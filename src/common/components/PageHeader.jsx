import React from 'react';

const PageHeader = ({ title, description, icon: Icon, children }) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b border-[var(--border)]">
      {/* 텍스트 및 아이콘 영역 */}
      <div className="flex items-start gap-3">
        {/* 아이콘이 존재할 때만 렌더링 */}
        {Icon && (
          <div className="mt-0.5 shrink-0">
            <Icon className="size-7 text-[var(--primary)]" />
          </div>
        )}
        
        <div className="flex flex-col gap-[0.375rem]">
          <h1 className="m-0 text-[1.5rem] font-bold text-[var(--foreground)] tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="m-0 text-[0.875rem] text-[var(--muted-foreground)]">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {/* 우측 액션 버튼 영역 */}
      {children && (
        <div className="flex items-center gap-2 shrink-0">
          {children}
        </div>
      )}
    </header>
  );
};

export default PageHeader;
