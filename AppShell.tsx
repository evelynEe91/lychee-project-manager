"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "项目总览", short: "总" },
  { href: "/import", label: "会议纪要", short: "会" },
  { href: "/board", label: "工作流看板", short: "看" },
  { href: "/tasks", label: "任务管理", short: "任" },
  { href: "/risks", label: "风险与决策", short: "险" },
  { href: "/qa", label: "项目问答", short: "问" },
  { href: "/weekly-report", label: "周报中心", short: "报" },
  { href: "/history", label: "历史记录", short: "史" }
];

const pageMeta = [
  { match: /^\/$/, title: "项目总览" },
  { match: /^\/import/, title: "会议纪要" },
  { match: /^\/board\/[^/]+/, title: "工作流详情" },
  { match: /^\/board/, title: "工作流看板" },
  { match: /^\/tasks/, title: "任务管理" },
  { match: /^\/risks/, title: "风险与决策" },
  { match: /^\/qa/, title: "项目问答" },
  { match: /^\/weekly-report/, title: "周报中心" },
  { match: /^\/history/, title: "历史记录" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentTitle =
    pageMeta.find((item) => item.match.test(pathname))?.title ?? "项目总览";

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <aside className="hidden h-screen border-r border-line bg-white px-5 py-6 lg:sticky lg:top-0 lg:block lg:overflow-y-auto">
        <div className="mb-8 border-b border-line pb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            lycheeVoice2.0
          </p>
          <h1 className="mt-2 text-xl font-bold leading-tight text-ink">
            项目管理助手
          </h1>
          <p className="mt-2 text-xs leading-5 text-muted">企业内部项目管理后台</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-50 text-brand ring-1 ring-blue-100"
                    : "text-muted hover:bg-slate-50 hover:text-ink"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-md text-xs ${
                    active ? "bg-brand text-white" : "bg-slate-100 text-muted"
                  }`}
                >
                  {item.short}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold text-muted">
                lycheeVoice2.0 项目管理助手
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink">{currentTitle}</h2>
            </div>
            <nav className="flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${
                      active ? "bg-brand text-white" : "bg-slate-100 text-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="hidden rounded-lg border border-line bg-slate-50 px-4 py-2 text-sm text-muted lg:block">
              当前周次：2026-W27 · 最近更新：2026-07-02
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
