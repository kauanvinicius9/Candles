import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { CartService } from './core/services/cart.service';

export const checkoutGuard: CanActivateFn = (route, state) => {
    const cartService = inject(CartService);
    const router = inject(Router);

    if (cartService.items().length > 0) {
        return true;
    }

    return router.createUrlTree(['/carrinho']);
};