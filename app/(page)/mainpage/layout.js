import Layout from "@/app/interface/layout";
import React from "react";
import { ThemeContext } from "@/app/context/ThemeContext";


export default function MainLayout({children}){
  return (
    <Layout>
      {children}
    </Layout>
  

  )
    
};