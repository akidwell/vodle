import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy, UrlSegment } from "@angular/router";

export class CustomReuseStrategy extends RouteReuseStrategy {
    private savedHandles: Map<string, DetachedRouteHandle> = new Map();


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

    public clearAllHandles(): void {
        this.savedHandles.forEach(c => {
            const handle = c;
            if (handle) {
                (handle as any).componentRef.destroy();
            }
        });
        this.savedHandles.clear();
    }

    // private getPath(route: ActivatedRouteSnapshot): string {
    //     let path = "";
    //     if (route.routeConfig != null && route.routeConfig.path != null)
    //         path = route.routeConfig.path;
    //     return path;
    // }

    private getPath(route: ActivatedRouteSnapshot) {
        // Build the complete path from the root to the input route
        const segments: UrlSegment[][] = route.pathFromRoot.map(r => r.url);
        const subpaths = ([] as UrlSegment[]).concat(...segments).map(segment => segment.path);
        // Result: ${route_depth}-${path}
        return segments.length + '-' + subpaths.join('/');
      }
      
}