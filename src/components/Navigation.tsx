'use client'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function FollowNav() {
  const path = usePathname();
  return (
    <div className=" my-4">
      <NavigationMenu defaultValue="suggestions">
        <NavigationMenuList className=" gap-2">
          <NavigationMenuItem>
            <Link href="/me/following"  passHref>
              <NavigationMenuLink active={path === '/me/following'} href="/me/following"  className={cn(navigationMenuTriggerStyle(), 'NavigationMenuLink' , ' font-extrabold')}>
                Following 
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem value="suggestions">
            <Link href="/me/suggestions"  passHref>
              <NavigationMenuLink active={path === '/me/suggestions'} href="/me/suggestions" className={cn(navigationMenuTriggerStyle(), 'NavigationMenuLink', ' font-extrabold')}>
                Suggestions 
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/me/reading-history"  passHref>
              <NavigationMenuLink active={path === '/me/reading-history'} className={cn(navigationMenuTriggerStyle(), 'NavigationMenuLink', ' font-extrabold')}>
                Reading History 
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem> 
          <NavigationMenuItem>
            <Link href="/me/saved" passHref>
              <NavigationMenuLink active={path === '/me/saved'} className={cn(navigationMenuTriggerStyle(), 'NavigationMenuLink', ' font-extrabold')}>
                Saved  
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>         
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

export default FollowNav;
