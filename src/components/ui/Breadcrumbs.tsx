import React from 'react';
import { Link } from '../../lib/router';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs text-[#8E8A83]">
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        <li>
          <Link href="/" className="hover:text-[#23201D] transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <span className="text-[#D5CCC0]" aria-hidden="true">/</span>
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-[#23201D] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#23201D] font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
