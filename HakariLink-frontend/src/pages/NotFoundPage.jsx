import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-bold text-primary opacity-10">404</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Page not found</h2>
      <p className="text-muted-foreground max-w-sm mb-8">
        The link you clicked may be broken or the page may have been removed.
      </p>
      <Link to="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}
