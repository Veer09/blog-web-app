import React from "react";
import Navbar from "../../components/Navbar";




export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Navbar>{children}</Navbar>;
}
