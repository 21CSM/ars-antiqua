<script lang="ts">
    import { AppBar, LightSwitch, Avatar } from '@skeletonlabs/skeleton';
    import { modeCurrent, setModeUserPrefers } from '@skeletonlabs/skeleton';
    import IconMenu from '~icons/mdi/menu';
    import IconAccount from '~icons/mdi/account';
    import IconLogout from '~icons/mdi/logout';
    import IconFileMusic from '~icons/mdi/file-music';
    import IconBookshelf from '~icons/mdi/bookshelf';
    import IconGear from '~icons/mdi/gear';
    import { userStore } from '$lib/stores/user';
    import { auth } from '$lib/firebase/auth';
    import { goto } from '$app/navigation';
    
    import logo from '$lib/assets/logo.svg';

    let isOpen = false;
    let userAvatar: string | null = null;
    let userName: string | null = null;
    let isDropdownOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;
    }

    function toggleDropdown() {
        isDropdownOpen = !isDropdownOpen;
    }

    function handleLightSwitch() {
        setModeUserPrefers($modeCurrent);
    }

    async function signOut() {
        try {
            await auth.signOut();
            goto('/');
            isDropdownOpen = false;
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    userStore.subscribe(state => {
        if (state.user) {
            userAvatar = state.user.photoURL || null;
            userName = state.user.displayName || state.user.email || 'User';
        } else {
            userAvatar = null;
            userName = null;
        }
    });

    function clickOutside(node: HTMLElement) {
        const handleClick = (event: MouseEvent) => {
            if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
                node.dispatchEvent(new CustomEvent('clickOutside'));
            }
        }
        
        document.addEventListener('click', handleClick, true);
        
        return {
            destroy() {
                document.removeEventListener('click', handleClick, true);
            }
        }
    }
</script>

<AppBar>
    <svelte:fragment slot="lead">
        <a href="/" class="flex items-center space-x-2">
            <img src={logo} alt="Ars Antiqua Online" class="h-10 {$modeCurrent ? '' : 'invert'}">
        </a>
    </svelte:fragment>
    <svelte:fragment slot="trail">
        <div class="hidden lg:flex items-center space-x-4">
            <nav class="flex space-x-2">
                <a href="/browse" class="btn btn-sm variant-ghost-surface">
                    <IconBookshelf class="w-5 h-5 mr-2" />
                    Browse All Scores
                </a>
                <a href="/manage" class="btn btn-sm variant-ghost-surface">
                    <IconFileMusic class="w-5 h-5 mr-2" />
                    Manage My Scores
                </a>
            </nav>
            <div class="border-l border-surface-500/30 h-6"></div>
            <LightSwitch on:change={handleLightSwitch} />
            <div class="border-l border-surface-500/30 h-6"></div>
            {#if userName}
                <div class="relative" use:clickOutside on:clickOutside={() => isDropdownOpen = false}>
                    <button 
                        class="flex items-center space-x-2 dropdown-toggle"
                        on:click={toggleDropdown}
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                    >
                        <span class="text-sm font-medium">{userName}</span>
                        <Avatar border="border-4 border-surface-300-600-token hover:!border-primary-500"
                        cursor="cursor-pointer" width="w-10" src={userAvatar ?? ''} background="bg-surface-500">
                            <IconAccount class="w-6 h-6" />
                        </Avatar>
                    </button>
                    {#if isDropdownOpen}
                        <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface-100-800-token dropdown-content">
                            <div class="py-1">
                                <button class="block w-full text-left px-4 py-2 text-sm hover:bg-surface-hover">
                                    <IconGear class="w-5 h-5 mr-2 inline-block" />
                                    Settings
                                </button>
                                <button on:click={signOut} class="block w-full text-left px-4 py-2 text-sm hover:bg-error-500 text-error-500 hover:text-error-50">
                                    <IconLogout class="w-5 h-5 mr-2 inline-block" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
        <div class="lg:hidden flex items-center space-x-4">
            <LightSwitch on:change={handleLightSwitch} />
            {#if userName}
                <div class="relative" use:clickOutside on:clickOutside={() => isDropdownOpen = false}>
                    <button on:click={toggleDropdown} class="dropdown-toggle" aria-haspopup="true" aria-expanded={isDropdownOpen}>
                        <Avatar border="border-4 border-surface-300-600-token hover:!border-primary-500"
                        cursor="cursor-pointer" width="w-10" src={userAvatar ?? ''} background="bg-surface-500">
                            <IconAccount class="w-5 h-5" />
                        </Avatar>
                    </button>
                    {#if isDropdownOpen}
                        <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface-100-800-token dropdown-content">
                            <div class="py-1">
                                <span class="block px-4 py-2 text-sm font-medium">{userName}</span>
                                <button class="block w-full text-left px-4 py-2 text-sm hover:bg-surface-hover">
                                    <IconGear class="w-5 h-5 mr-2 inline-block" />
                                    Settings
                                </button>
                                <button on:click={signOut} class="block w-full text-left px-4 py-2 text-sm hover:bg-error-500 text-error-500 hover:text-error-50">
                                    <IconLogout class="w-5 h-5 mr-2 inline-block" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
            <button class="btn btn-sm variant-ghost-surface" on:click={toggleMenu}>
                <IconMenu class="w-5 h-5" />
            </button>
        </div>
    </svelte:fragment>
</AppBar>

{#if isOpen}
    <nav class="lg:hidden p-4 space-y-2 bg-surface-100-800-token">
        <a href="/browse" class="btn btn-sm variant-ghost-surface w-full justify-start">
            <IconBookshelf class="w-5 h-5 mr-2" />
            Browse All Scores
        </a>
        <a href="/manage" class="btn btn-sm variant-ghost-surface w-full justify-start">
            <IconFileMusic class="w-5 h-5 mr-2" />
            Manage My Scores
        </a>
    </nav>
{/if}

<style>
    .invert {
        filter: invert(1);
    }
</style>