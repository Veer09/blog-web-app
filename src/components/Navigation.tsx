'use client'
import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
function FollowNav() {
  const path = usePathname();
  return (
    <div className=" my-4">
      <NavigationMenu defaultValue="suggestions">
        <NavigationMenuList className=" gap-2">
          <NavigationMenuItem>
              <NavigationMenuLink active={path === '/me/following'} href="/me/following"  className={cn(navigationMenuTriggerStyle(), 'NavigationMenuLink' , ' font-extrabold')}>
                Following 
              </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem value="suggestions">
              <NavigationMenuLink active={path === '/me/suggestions'} href="/me/suggestions" className={cn(navigationMenuTriggerStyle(), 'NavigationMenuLink', ' font-extrabold')}>
                Suggestions 
              </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/me/reading-history" legacyBehavior passHref>
              <NavigationMenuLink active={path === '/me/reading-history'} className={cn(navigationMenuTriggerStyle(), 'NavigationMenuLink', ' font-extrabold')}>
                Reading History 
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem> 
          <NavigationMenuItem>
            <Link href="/me/saved" legacyBehavior passHref>
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
