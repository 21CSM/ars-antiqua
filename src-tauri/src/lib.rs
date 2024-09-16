use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Extract migrations to a separate function
fn get_migrations() -> Vec<Migration> {
    vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "
                -- Create MEI_FILE table
                CREATE TABLE MEI_FILE (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    filename TEXT NOT NULL,
                    content TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                -- Create METADATA table
                CREATE TABLE METADATA (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    mei_file_id INTEGER NOT NULL,
                    key TEXT NOT NULL,
                    value TEXT NOT NULL,
                    FOREIGN KEY (mei_file_id) REFERENCES MEI_FILE(id) ON DELETE CASCADE
                );
                -- Create TAG table
                CREATE TABLE TAG (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL
                );
                -- Create FILE_TAG junction table
                CREATE TABLE FILE_TAG (
                    mei_file_id INTEGER NOT NULL,
                    tag_id INTEGER NOT NULL,
                    PRIMARY KEY (mei_file_id, tag_id),
                    FOREIGN KEY (mei_file_id) REFERENCES MEI_FILE(id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES TAG(id) ON DELETE CASCADE
                );
                -- Create indexes for better query performance
                CREATE INDEX idx_metadata_mei_file_id ON METADATA(mei_file_id);
                CREATE INDEX idx_metadata_key ON METADATA(key);
                CREATE INDEX idx_file_tag_mei_file_id ON FILE_TAG(mei_file_id);
                CREATE INDEX idx_file_tag_tag_id ON FILE_TAG(tag_id);
            ",
        kind: MigrationKind::Up,
    }]
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = get_migrations();
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:ars-antiqua.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use sqlx::{sqlite::SqlitePoolOptions, Row, SqlitePool};

    async fn setup_test_db() -> Result<SqlitePool, sqlx::Error> {
        let pool = SqlitePoolOptions::new().connect("sqlite::memory:").await?;

        // Run migrations
        for migration in get_migrations() {
            sqlx::query(&migration.sql).execute(&pool).await?;
        }

        Ok(pool)
    }

    #[tokio::test]
    async fn test_migrations() -> Result<(), Box<dyn std::error::Error>> {
        let pool = setup_test_db().await?;

        // Test table creation
        let tables = sqlx::query("SELECT name FROM sqlite_master WHERE type='table'")
            .fetch_all(&pool)
            .await?;

        let table_names: Vec<String> = tables.iter().map(|row| row.get("name")).collect();
        assert!(table_names.contains(&"MEI_FILE".to_string()));
        assert!(table_names.contains(&"METADATA".to_string()));
        assert!(table_names.contains(&"TAG".to_string()));
        assert!(table_names.contains(&"FILE_TAG".to_string()));

        // Test index creation
        let indexes = sqlx::query("SELECT name FROM sqlite_master WHERE type='index'")
            .fetch_all(&pool)
            .await?;

        let index_names: Vec<String> = indexes.iter().map(|row| row.get("name")).collect();
        assert!(index_names.contains(&"idx_metadata_mei_file_id".to_string()));
        assert!(index_names.contains(&"idx_metadata_key".to_string()));
        assert!(index_names.contains(&"idx_file_tag_mei_file_id".to_string()));
        assert!(index_names.contains(&"idx_file_tag_tag_id".to_string()));

        // Test table structure
        let mei_file_columns = sqlx::query("PRAGMA table_info(MEI_FILE)")
            .fetch_all(&pool)
            .await?;
        assert_eq!(mei_file_columns.len(), 5); // id, filename, content, created_at, updated_at

        let metadata_columns = sqlx::query("PRAGMA table_info(METADATA)")
            .fetch_all(&pool)
            .await?;
        assert_eq!(metadata_columns.len(), 4); // id, mei_file_id, key, value

        let tag_columns = sqlx::query("PRAGMA table_info(TAG)")
            .fetch_all(&pool)
            .await?;
        assert_eq!(tag_columns.len(), 2); // id, name

        let file_tag_columns = sqlx::query("PRAGMA table_info(FILE_TAG)")
            .fetch_all(&pool)
            .await?;
        assert_eq!(file_tag_columns.len(), 2); // mei_file_id, tag_id

        Ok(())
    }
}
