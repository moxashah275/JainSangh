import PageHeader from './PageHeader'
import SearchBar from './SearchBar'
import EmptyState from './EmptyState'
import StatCard from './StatCard'

export default function CommonPageLayout({
  title,
  subtitle,
  breadcrumbs,
  action,
  stats = [],
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  toolbar,
  children,
  isEmpty = false,
  emptyState,
  className = '',
  contentClassName = '',
}) {
  const hasControls = typeof searchValue === 'string' || toolbar
  const statGridClass = stats.length === 3
    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'

  return (
    <div className={`-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 px-5 lg:px-7 pt-4 pb-6 bg-[#f8fafc] min-h-[calc(100vh-3.5rem)] ${className}`}>
      <div className="max-w-[1480px] space-y-5">
        <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} action={action} />

        {stats.length ? (
          <div className={statGridClass}>
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        ) : null}

        {hasControls ? (
          <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col lg:flex-row lg:items-center gap-3">
            {typeof searchValue === 'string' ? (
              <div className="w-full lg:max-w-sm">
                <SearchBar value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
              </div>
            ) : null}
            {toolbar ? <div className="flex-1">{toolbar}</div> : null}
          </div>
        ) : null}

        {isEmpty ? emptyState || <EmptyState /> : <div className={contentClassName}>{children}</div>}
      </div>
    </div>
  )
}
