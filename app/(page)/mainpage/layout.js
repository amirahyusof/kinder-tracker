import Layout from "@/app/interface/layout";
import React from "react";
import { CURRENT_APP_VERSION } from "@/lib/constants";

export default function MainLayout({children}){
  return (
    <Layout>
      {children}
    </Layout>
  

  )
    
};