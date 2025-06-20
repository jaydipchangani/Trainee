import { animate, style, transition, trigger, query, group } from '@angular/animations';

export const slideInOutAnimation = trigger('slideInOut', [
  transition(':increment', [
    // Next slide (from right)
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('400ms cubic-bezier(.77,0,.18,1)', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms cubic-bezier(.77,0,.18,1)', style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true })
    ])
  ]),
  transition(':decrement', [
    // Previous slide (from left)
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('400ms cubic-bezier(.77,0,.18,1)', style({ transform: 'translateX(100%)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('400ms cubic-bezier(.77,0,.18,1)', style({ transform: 'translateX(0%)', opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);
