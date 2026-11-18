/** Plain text typed in the admin: a blank line starts a new paragraph, a single line break stays a line break. */
export function Text({ children }: { children: string }) {
  return (
    <div className="grid max-w-3xl gap-4 leading-7">
      {children.split(/\n\s*\n/).map((paragraph, i) => <p key={i} className="whitespace-pre-line">{paragraph.trim()}</p>)}
    </div>
  );
}
