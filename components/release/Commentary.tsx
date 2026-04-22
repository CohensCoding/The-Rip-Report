import type { Release } from "@/types/release";

import { ReleaseSection } from "./Section";

function paragraphs(text: string) {
  const chunks = text
    .split(/\n\s*\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return chunks.length ? chunks : [text.trim()].filter(Boolean);
}

function Prose({ children }: { children: string }) {
  const ps = paragraphs(children);
  return (
    <div className="space-y-4 text-base leading-relaxed text-paper/85">
      {ps.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}

export function Commentary({ release }: { release: Release }) {
  const c = release.commentary;

  const hasAny =
    Boolean(c.whatsNew?.trim()) ||
    Boolean(c.whatMatters?.trim()) ||
    Boolean(c.compToLastYear?.trim()) ||
    Boolean(c.redFlags?.trim()) ||
    Boolean(c.bullCase?.trim()) ||
    Boolean(c.bearCase?.trim());

  if (!hasAny) return null;

  const bullBearTogether = Boolean(c.bullCase?.trim()) && Boolean(c.bearCase?.trim());

  return (
    <ReleaseSection eyebrow="THE TAKE" innerClassName="max-w-3xl">
      <div className="space-y-14">
        {c.whatsNew?.trim() ? (
          <div>
            <h3 className="font-serif text-2xl text-paper">What's New</h3>
            <div className="mt-4">
              <Prose>{c.whatsNew}</Prose>
            </div>
          </div>
        ) : null}

        {c.whatMatters?.trim() ? (
          <div>
            <h3 className="font-serif text-3xl text-paper">What Actually Matters</h3>
            <div className="mt-5 text-lg leading-relaxed text-paper/90">
              <Prose>{c.whatMatters}</Prose>
            </div>
          </div>
        ) : null}

        {/* formatAdvice is intentionally omitted here when present — BoxFormats renders it as a pullquote. */}

        {c.compToLastYear?.trim() ? (
          <div>
            <h3 className="font-serif text-2xl text-paper">How It Compares</h3>
            <div className="mt-4">
              <Prose>{c.compToLastYear}</Prose>
            </div>
          </div>
        ) : null}

        {c.redFlags?.trim() ? (
          <div>
            <h3 className="font-serif text-2xl text-paper">Red Flags</h3>
            <div className="mt-4">
              <Prose>{c.redFlags}</Prose>
            </div>
          </div>
        ) : null}

        {bullBearTogether ? (
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-serif text-2xl text-paper">Bull Case</h3>
              <div className="mt-4">
                <Prose>{c.bullCase!}</Prose>
              </div>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-paper">Bear Case</h3>
              <div className="mt-4">
                <Prose>{c.bearCase!}</Prose>
              </div>
            </div>
          </div>
        ) : (
          <>
            {c.bullCase?.trim() ? (
              <div>
                <h3 className="font-serif text-2xl text-paper">Bull Case</h3>
                <div className="mt-4">
                  <Prose>{c.bullCase}</Prose>
                </div>
              </div>
            ) : null}
            {c.bearCase?.trim() ? (
              <div>
                <h3 className="font-serif text-2xl text-paper">Bear Case</h3>
                <div className="mt-4">
                  <Prose>{c.bearCase}</Prose>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </ReleaseSection>
  );
}
