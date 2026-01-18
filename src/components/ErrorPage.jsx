import { useState } from "react";

export function ErrorPage({ errorMessage }){
    if(!errorMessage)return null;
    return(
        <p>errorMessage</p>
    )
}