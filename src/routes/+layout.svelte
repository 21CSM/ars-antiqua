<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { userStore } from '$lib/stores/user';
    import LoginForm from '$lib/components/auth/LoginForm.svelte';
    import LoadingScreen from '$lib/components/shell/LoadingScreen.svelte';
    import AuthenticatedApp from '$lib/components/shell/AuthenticatedApp.svelte';
    import '../app.postcss';
    import { setInitialClassState } from '@skeletonlabs/skeleton';

    // State variables
    let loading = true;
    let authenticated = false;

    // Subscribe to userStore
    const unsubscribe = userStore.subscribe((state) => {
        loading = state.loading;
        authenticated = !!state.user;
    });

    onMount(() => {
        setInitialClassState();
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<svelte:head>
    {@html `<script nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>

<div class="app-container">
    {#if loading}
        <LoadingScreen />
    {:else if authenticated}
        <AuthenticatedApp>
            <div class="content-container">
                <slot />
            </div>
        </AuthenticatedApp>
    {:else}
        <LoginForm />
    {/if}
</div>