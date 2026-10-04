export function FilmFrame({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  return (
    <video
      className={className}
      poster={poster}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
    />
  );
}
