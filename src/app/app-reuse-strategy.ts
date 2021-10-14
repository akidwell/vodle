import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from "@angular/router";

export class CustomReuseStrategy extends RouteReuseStrategy {
    private savedHandles = new Map<string, DetachedRouteHandle>();

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        return this.savedHandles.get(this.getPath(route)) as DetachedRouteHandle;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return this.savedHandles.has(this.getPath(route));
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data.saveComponent;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        this.savedHandles.set(this.getPath(route), handle);
    }

    public clearSavedHandle(key: string): void {
        const handle = this.savedHandles.get(key);
        if (handle) {
            (handle as any).componentRef.destroy();
        }

        this.savedHandles.delete(key);
    }

    private getPath(route: ActivatedRouteSnapshot): string {
        let path = "";
        if (route.routeConfig != null && route.routeConfig.path != null)
            path = route.routeConfig.path;
        return path;
    }
}