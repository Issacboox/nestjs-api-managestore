import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();
        // const session = request.session;
        // if(session.userId){
        //     return true;
        // }
        // return false;
        return request.session.userId;
    }
}