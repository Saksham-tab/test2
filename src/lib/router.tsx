import React, { createContext, useContext, useEffect, useState } from 'react';
import { brandConfig } from '../config/brand';
import { analytics } from './analytics';

interface RouterContextType {
  path: string;
  search: string;
  queryParams: URLSearchParams;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  search: '',
  queryParams: new URLSearchParams(),
  navigate: () => {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );
  const [search, setSearch] = useState(
    typeof window !== 'undefined' ? window.location.search || '' : ''
  );

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname || '/');
      setSearch(window.location.search || '');
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;

    const [newPath, newSearch] = to.split('?');
    const fullSearch = newSearch ? `?${newSearch}` : '';

    if (options?.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    setPath(newPath || '/');
    setSearch(fullSearch);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    analytics.track('page_view', { path: newPath || '/', search: fullSearch });
  };

  const queryParams = new URLSearchParams(search);

  return (
    <RouterContext.Provider value={{ path, search, queryParams, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ href, replace, children, className, onClick, ...props }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && href.startsWith('/')) {
      e.preventDefault();
      navigate(href, { replace });
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
};

export function updatePageMeta(title: string, description?: string) {
  if (typeof document === 'undefined') return;
  document.title = `${title} | ${brandConfig.name}`;
  if (description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }
}
