import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
    const secureReq = req.clone({
        setHeaders: {
            "X-Internal-Secret": environment.apiSecretKey
        }
    });
    return next(secureReq);
}