import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-10 text-center">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">{description}</p>
      )}
      {children}
    </div>
  );
}