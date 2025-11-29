<script>
    import { onMount, createEventDispatcher } from 'svelte';
    
    export let sitekey;
    
    const dispatch = createEventDispatcher();
    let recaptchaContainer;
    let widgetId;
    
    onMount(() => {
        // Load reCAPTCHA script
        if (!window.grecaptcha) {
            const script = document.createElement('script');
            script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            script.onload = initRecaptcha;
            document.head.appendChild(script);
        } else {
            initRecaptcha();
        }
        
        return () => {
            // Cleanup
            if (widgetId !== undefined && window.grecaptcha) {
                try {
                    window.grecaptcha.reset(widgetId);
                } catch (e) {
                    console.log('Recaptcha cleanup error:', e);
                }
            }
        };
    });
    
    function initRecaptcha() {
        if (!window.grecaptcha || !window.grecaptcha.render) {
            setTimeout(initRecaptcha, 100);
            return;
        }
        
        try {
            widgetId = window.grecaptcha.render(recaptchaContainer, {
                'sitekey': sitekey,
                'callback': onSuccess,
                'expired-callback': onExpired,
                'error-callback': onError
            });
        } catch (e) {
            console.error('Error rendering recaptcha:', e);
        }
    }
    
    function onSuccess(token) {
        dispatch('success', { token });
    }
    
    function onExpired() {
        dispatch('expired');
    }
    
    function onError() {
        dispatch('error');
    }
    
    export function reset() {
        if (widgetId !== undefined && window.grecaptcha) {
            window.grecaptcha.reset(widgetId);
        }
    }
</script>

<div bind:this={recaptchaContainer}></div>
