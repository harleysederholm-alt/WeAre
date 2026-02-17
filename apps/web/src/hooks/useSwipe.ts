import { useState, useRef, TouchEvent } from 'react';

interface SwipeHandlers {
    onTouchStart: (e: TouchEvent) => void;
    onTouchMove: (e: TouchEvent) => void;
    onTouchEnd: () => void;
}

interface UseSwipeOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    edgeOnly?: boolean; // If true, only triggers if swipe starts from edge
    edgeThreshold?: number; // Pixels from edge to consider "edge"
}

export const useSwipe = ({ onSwipeLeft, onSwipeRight, edgeOnly = false, edgeThreshold = 30 }: UseSwipeOptions): SwipeHandlers => {
    const touchStart = useRef<{ x: number, y: number } | null>(null);
    const touchEnd = useRef<{ x: number, y: number } | null>(null);

    // Minimum distance to be considered a swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: TouchEvent) => {
        touchEnd.current = null;
        touchStart.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        };
    };

    const onTouchMove = (e: TouchEvent) => {
        touchEnd.current = {
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        };
    };

    const onTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;

        const distanceX = touchStart.current.x - touchEnd.current.x;
        const distanceY = touchStart.current.y - touchEnd.current.y;

        const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

        if (isHorizontalSwipe) {
            // Screen Width for edge detection
            const isLeftEdge = touchStart.current.x < edgeThreshold;
            const isRightEdge = touchStart.current.x > window.innerWidth - edgeThreshold;

            const isSwipeLeft = distanceX > minSwipeDistance;
            const isSwipeRight = distanceX < -minSwipeDistance;

            if (edgeOnly) {
                if (isSwipeRight && isLeftEdge && onSwipeRight) {
                    onSwipeRight();
                }
                if (isSwipeLeft && isRightEdge && onSwipeLeft) {
                    onSwipeLeft();
                }
            } else {
                if (isSwipeLeft && onSwipeLeft) {
                    onSwipeLeft();
                }
                if (isSwipeRight && onSwipeRight) {
                    onSwipeRight();
                }
            }
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
};
