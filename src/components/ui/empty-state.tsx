export function EmptyState({ title, description, icon, variant = "no-data", action }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-xl border border-cyan-500/20 bg-black/60 backdrop-blur-xl">
      {icon && <div className="mb-4 text-cyan-400">{icon}</div>}
      <h3 className="text-xl font-bold font-mono text-white mb-2">{title}</h3>
      <p className="text-sm font-mono text-cyan-400/60 text-center mb-4">{description}</p>
      {action && (
        <button onClick={action.onClick} className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-sm hover:bg-cyan-500/20">
          {action.label}
        </button>
      )}
    </div>
  );
}