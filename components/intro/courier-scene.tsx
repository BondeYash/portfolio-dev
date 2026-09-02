"use client";

/* ------------------------------------------------------------------
   The opening scene, drawn as one plate. Everything is line work over
   flat stock — the way a press could actually print it — so the whole
   thing animates as transforms and never as a repaint.

   The scene is authored at 1600 x 900 and sliced to fit, so the action
   is kept well inside the middle third: nothing that matters lives at
   an edge a phone would crop.
   ------------------------------------------------------------------ */

const GROUND = 760;

/** A row of buildings, set back behind the rider. */
function Skyline({
  id,
  y,
  opacity,
}: {
  id: string;
  y: number;
  opacity: number;
}) {
  const blocks = [
    { x: 60, w: 150, h: 250, roof: "flat" },
    { x: 214, w: 96, h: 170, roof: "flat" },
    { x: 314, w: 132, h: 320, roof: "dome" },
    { x: 450, w: 108, h: 210, roof: "flat" },
    { x: 562, w: 164, h: 285, roof: "step" },
    { x: 730, w: 112, h: 195, roof: "flat" },
    { x: 846, w: 148, h: 340, roof: "spire" },
    { x: 998, w: 120, h: 225, roof: "flat" },
    { x: 1122, w: 158, h: 300, roof: "step" },
    { x: 1284, w: 104, h: 190, roof: "flat" },
    { x: 1392, w: 148, h: 268, roof: "dome" },
  ];

  return (
    <g id={id} opacity={opacity} className="ink-fill">
      {blocks.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={y - b.h} width={b.w} height={b.h} />
          {b.roof === "dome" ? (
            <ellipse cx={b.x + b.w / 2} cy={y - b.h} rx={b.w / 2.4} ry={34} />
          ) : null}
          {b.roof === "spire" ? (
            <path
              d={`M${b.x + b.w / 2 - 16} ${y - b.h} L${b.x + b.w / 2} ${
                y - b.h - 76
              } L${b.x + b.w / 2 + 16} ${y - b.h} Z`}
            />
          ) : null}
          {b.roof === "step" ? (
            <rect
              x={b.x + b.w / 4}
              y={y - b.h - 42}
              width={b.w / 2}
              height={42}
            />
          ) : null}
          {/* windows, punched as a grid of light holes */}
          {Array.from({ length: Math.floor(b.h / 46) }).map((_, row) =>
            Array.from({ length: Math.max(1, Math.floor(b.w / 40)) }).map(
              (__, col) => (
                <rect
                  key={`${row}-${col}`}
                  className="win"
                  x={b.x + 16 + col * 40}
                  y={y - b.h + 26 + row * 46}
                  width={15}
                  height={22}
                />
              ),
            ),
          )}
        </g>
      ))}
    </g>
  );
}

/** A rolled edition, drawn from the side. Used in the bag and in the hand. */
function Roll({ id, band = true }: { id?: string; band?: boolean }) {
  return (
    <g id={id}>
      <rect className="paper-fill" x={-58} y={-15} width={116} height={30} rx={13} />
      {band ? <rect className="spot-fill" x={-14} y={-15} width={22} height={30} /> : null}
      <ellipse className="paper-fill ink-stroke" cx={-58} cy={0} rx={7} ry={15} />
      <path className="ink-stroke" d="M-58 -15 H58 M-58 15 H58" />
      <path className="ink-hair" d="M-40 -7 H30 M-40 0 H24 M-40 7 H30" />
    </g>
  );
}

export function CourierScene() {
  return (
    <svg
      id="intro-plate"
      className="intro-plate"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* wobble, so the line looks pressed rather than plotted */}
        <filter id="press-ink" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028"
            numOctaves="2"
            seed="7"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
        </filter>
        <radialGradient id="lamp-glow">
          <stop offset="0%" stopColor="rgb(var(--spot))" stopOpacity="0.28" />
          <stop offset="100%" stopColor="rgb(var(--spot))" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---------- the plate itself ---------- */}
      <rect width="1600" height="900" className="stock-fill" />

      {/* ---------- everything the camera pans across ---------- */}
      <g id="scene-far" filter="url(#press-ink)">
        <Skyline id="skyline-far" y={GROUND - 6} opacity={0.26} />
      </g>

      <g id="scene-mid" filter="url(#press-ink)">
        <Skyline id="skyline-mid" y={GROUND + 4} opacity={0.46} />

        {/* street lamp */}
        <g id="lamp" className="ink-fill" opacity="0.62">
          <circle className="glow" cx={286} cy={452} r={96} />
          <rect x={280} y={452} width={12} height={310} />
          <rect x={252} y={742} width={68} height={16} rx={6} />
          <path d="M262 452 h52 l-12 -34 h-28 Z" />
          <rect x={274} y={404} width={24} height={18} rx={4} />
        </g>

        {/* bench */}
        <g id="bench" className="ink-stroke" opacity="0.5">
          <path d="M120 700 h180 M120 722 h180 M136 700 v52 M284 700 v52 M136 688 h164" />
        </g>

        {/* birds, two strokes each */}
        <g id="birds" className="ink-hair" opacity="0.55">
          <path d="M1180 214 q14 -12 28 0 q14 -12 28 0" />
          <path d="M1268 168 q11 -9 22 0 q11 -9 22 0" />
        </g>
      </g>

      {/* ---------- the street ---------- */}
      <g id="street">
        <rect x={0} y={GROUND} width={1600} height={140} className="road-fill" />
        <path className="ink-stroke" d={`M0 ${GROUND} H1600`} />
        <g className="ink-hair" opacity="0.45">
          {Array.from({ length: 22 }).map((_, i) => (
            <path key={i} d={`M${i * 76 - 20} ${GROUND + 34} l38 0`} />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={`b${i}`} d={`M${i * 104 + 30} ${GROUND + 78} l52 0`} />
          ))}
        </g>
      </g>

      {/* ---------- dust kicked up off the road ---------- */}
      <g id="dust" className="ink-fill" opacity="0">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            className="puff"
            cx={640 - i * 46}
            cy={GROUND - 14 - (i % 2) * 16}
            r={10 + (i % 3) * 5}
            opacity={0.22}
          />
        ))}
      </g>

      {/* ---------- the courier, drawn as one rig ---------- */}
      <g id="rider">
        <g id="rider-bob">
          {/* --- bicycle --- */}
          <g id="bike">
            <g id="wheel-rear" className="wheel">
              <circle className="ink-stroke tyre" cx={700} cy={690} r={68} />
              <circle className="ink-stroke" cx={700} cy={690} r={58} />
              <g className="ink-hair spokes">
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * Math.PI) / 6;
                  return (
                    <path
                      key={i}
                      d={`M700 690 L${(700 + Math.cos(a) * 57).toFixed(1)} ${(
                        690 +
                        Math.sin(a) * 57
                      ).toFixed(1)}`}
                    />
                  );
                })}
              </g>
              <circle className="ink-fill" cx={700} cy={690} r={7} />
            </g>

            <g id="wheel-front" className="wheel">
              <circle className="ink-stroke tyre" cx={940} cy={690} r={68} />
              <circle className="ink-stroke" cx={940} cy={690} r={58} />
              <g className="ink-hair spokes">
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i * Math.PI) / 6;
                  return (
                    <path
                      key={i}
                      d={`M940 690 L${(940 + Math.cos(a) * 57).toFixed(1)} ${(
                        690 +
                        Math.sin(a) * 57
                      ).toFixed(1)}`}
                    />
                  );
                })}
              </g>
              <circle className="ink-fill" cx={940} cy={690} r={7} />
            </g>

            <g className="ink-stroke frame">
              <path d="M700 690 L820 700 L752 600 Z" />
              <path d="M752 600 L944 596 M820 700 L944 596 M944 596 L952 574" />
              <path d="M752 600 L742 578" />
              <path d="M944 690 L944 596" />
            </g>
            <path className="ink-fill" d="M712 570 q30 -14 58 0 q-28 14 -58 0" />
            <path className="ink-stroke bar" d="M926 570 h54 M952 574 v-8" />
            <g id="crank">
              <circle className="ink-stroke" cx={820} cy={700} r={22} />
              <path className="ink-stroke" d="M820 700 L800 722 M820 700 L840 678" />
              <rect className="ink-fill" x={790} y={718} width={22} height={8} rx={3} />
              <rect className="ink-fill" x={830} y={672} width={22} height={8} rx={3} />
            </g>
            <path className="ink-hair" d="M700 690 L820 700" opacity="0.7" />
          </g>

          {/* --- the far leg, behind the frame --- */}
          <g id="leg-far" className="limb-far">
            <path d="M756 566 L798 650 L802 702" />
          </g>

          {/* --- the bag, slung round to the back --- */}
          <g id="bag">
            <g id="bag-papers">
              <g transform="translate(672 572) rotate(-22) scale(0.52)">
                <Roll band={false} />
              </g>
              <g transform="translate(698 562) rotate(-12) scale(0.52)">
                <Roll band={false} />
              </g>
              <g transform="translate(724 566) rotate(-2) scale(0.52)">
                <Roll band={false} />
              </g>
            </g>
            <rect className="leather-fill" x={652} y={582} width={118} height={94} rx={12} />
            <path className="ink-stroke" d="M652 606 h118" />
            <path className="ink-fill flap" d="M652 582 h118 v26 q-59 17 -118 0 Z" />
            <text className="bag-mark" x={711} y={648} textAnchor="middle">
              &lt;/&gt;
            </text>
          </g>

          {/* --- the far arm keeps a hand on the bars throughout --- */}
          <g id="arm-far" className="limb-far">
            <path d="M834 462 L888 512 L940 566" />
          </g>

          {/* --- trousers: one dark mass from the saddle to the knee --- */}
          <path className="trouser" d="M742 578 L788 566" />

          {/* --- the shirt, drawn as a limb: dark outline, light fill --- */}
          <g id="torso">
            <path className="body-out" d="M764 566 L838 454" />
            <path className="body-in" d="M764 566 L838 454" />
            <path className="ink-stroke braces" d="M771 571 L845 459 M756 561 L830 449" />
            <path className="ink-stroke collar" d="M824 442 l20 15" />
            <path className="ink-stroke strap" d="M846 458 L704 592" />
          </g>

          {/* --- the near leg, pedalling --- */}
          <g id="leg-near" className="limb-near">
            <path className="thigh" d="M764 566 L828 648 L838 700" />
            <path className="shoe" d="M824 694 h36 q12 0 12 12 h-50 Z" />
          </g>

          {/* --- neck, head, cap --- */}
          <g id="head">
            <path className="body-out neck" d="M840 458 L866 430" />
            <path className="body-in neck" d="M840 458 L866 430" />
            <path className="hair-fill" d="M846 392 q48 -40 90 -4 q11 34 -4 54 q-48 11 -86 -9 Z" />
            <circle className="face-fill face-line" cx={892} cy={412} r={46} />
            <g id="face">
              <circle className="ink-fill eye" cx={909} cy={404} r={6} />
              <circle className="ink-fill eye" cx={883} cy={406} r={6} />
              <path className="ink-stroke smile" d="M880 431 q16 14 32 -3" />
            </g>
            <g id="cap">
              <path className="cap-fill" d="M840 388 q50 -53 104 -10 q8 16 2 26 q-54 15 -106 -16 Z" />
              <path className="cap-fill brim" d="M940 380 q39 5 48 22 q-44 10 -52 -6 Z" />
              <circle className="ink-fill" cx={895} cy={350} r={5} />
            </g>
          </g>

          {/* --- the throwing arm, hinged at the shoulder --- */}
          <g id="arm">
            <g id="arm-upper">
              <path className="body-out sleeve" d="M838 454 L896 510" />
              <path className="body-in sleeve" d="M838 454 L896 510" />
              <g id="arm-fore">
                <path className="skin-out" d="M896 510 L946 564" />
                <path className="skin-in" d="M896 510 L946 564" />
                <path className="ink-stroke cuff" d="M886 518 l21 -18" />
                <g id="hand">
                  <circle className="face-fill face-line" cx={948} cy={566} r={14} />
                  <g
                    id="hand-roll"
                    opacity="0"
                    transform="translate(948 566) rotate(-18) scale(0.62)"
                  >
                    <Roll />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      {/* ---------- speed lines, struck on the throw ---------- */}
      <g id="speed" className="ink-hair" opacity="0">
        {Array.from({ length: 34 }).map((_, i) => {
          const a = (i / 34) * Math.PI * 2;
          /* struck from the hand, so the eye is pulled to the throw */
          const x = 960 + Math.cos(a) * 190;
          const y = 520 + Math.sin(a) * 190;
          return (
            <path
              key={i}
              d={`M${x.toFixed(1)} ${y.toFixed(1)} L${(
                960 +
                Math.cos(a) * 640
              ).toFixed(1)} ${(520 + Math.sin(a) * 640).toFixed(1)}`}
            />
          );
        })}
      </g>
    </svg>
  );
}
