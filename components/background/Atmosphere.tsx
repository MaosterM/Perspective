import { MatrixRain } from "@/components/background/MatrixRain";

/**
 * Global animated background, fixed behind every section.
 *
 * Layers, back to front:
 *   blobs   three slow-drifting light fields (blue, deep blue, crimson), CSS
 *   rain    Matrix-style code rain on a transparent canvas (MatrixRain)
 *   rays    a wide conic moonlight beam that turns once every ~3 minutes, CSS
 *   grid    a coordinate grid that drifts exactly one cell per loop, CSS
 *   slashes crimson/blue diagonal lines whose depth shifts with page scroll
 *           (MotionRoot drives [data-drift] with a scrubbed GSAP tween)
 *   grain   static film grain
 *
 * Everything except the rain animates only transform and opacity, so it stays
 * on the compositor. html[data-atmos] (set by MotionRoot from the section in
 * view) changes which layers are strongest and tints the rain.
 */
export function Atmosphere() {
  return (
    <div className="atmos" aria-hidden="true">
      <div className="atmos-blob atmos-a" />
      <div className="atmos-blob atmos-b" />
      <div className="atmos-blob atmos-c" />
      <MatrixRain />
      <div className="atmos-rays" />
      <div className="atmos-grid" />

      <div className="atmos-slash atmos-slash-1" data-drift="16">
        <i />
      </div>
      <div className="atmos-slash atmos-slash-2" data-drift="-10">
        <i />
      </div>
      <div className="atmos-slash atmos-slash-3" data-drift="24">
        <i />
      </div>

      <div className="atmos-grain" />
    </div>
  );
}
