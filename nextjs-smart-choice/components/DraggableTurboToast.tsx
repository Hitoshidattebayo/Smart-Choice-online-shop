'use client';

import { useEffect } from 'react';

export default function DraggableTurboToast() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        let observer: MutationObserver | null = null;
        let dragElement: HTMLElement | null = null;

        const makeElementDraggable = (elmnt: HTMLElement) => {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            // Ensure element has cursor style clearly indicating draggability
            elmnt.style.cursor = 'grab';

            elmnt.onmousedown = dragMouseDown;

            function dragMouseDown(e: MouseEvent) {
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
                elmnt.style.cursor = 'grabbing';
            }

            function elementDrag(e: MouseEvent) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                // Next.js toasts often use bottom/right. Unset them so top/left works.
                const rect = elmnt.getBoundingClientRect();
                elmnt.style.bottom = 'auto';
                elmnt.style.right = 'auto';
                elmnt.style.top = (rect.top - pos2) + "px";
                elmnt.style.left = (rect.left - pos1) + "px";
                elmnt.style.transform = 'none'; // Overwrite centering transforms if any
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
                elmnt.style.cursor = 'grab';
            }
        };

        const attemptToMakeDraggable = () => {
            // Find nextjs portal
            const portal = document.querySelector('nextjs-portal');
            if (portal && portal.shadowRoot) {
                // The toast wrapper with data-nextjs-toast inside shadow root
                const toastWrapper = portal.shadowRoot.querySelector('[data-nextjs-toast]') as HTMLElement;
                if (toastWrapper && toastWrapper !== dragElement) {
                    dragElement = toastWrapper;
                    makeElementDraggable(toastWrapper);

                    // Next.js toast has an inner container that might block our events, so make children pointer-events-none if needed, 
                    // or just attach drag to the wrapper.
                    return true;
                }
            }
            return false;
        };

        // Keep trying to find the toast as it gets injected dynamically
        const intervalId = setInterval(() => {
            const found = attemptToMakeDraggable();
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return null;
}
