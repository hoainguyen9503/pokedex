import { useEffect, useState, type ImgHTMLAttributes } from "react";

type ResilientImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  sources: string[];
};

export default function ResilientImage({ sources, className = "", alt = "", ...props }: ResilientImageProps) {
  const usableSources = sources.filter(Boolean);
  const sourceKey = usableSources.join("|");
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
  }, [sourceKey]);

  if (!usableSources.length || failed) {
    return <span className={`image-fallback ${className}`} role="img" aria-label={alt || "Ảnh chưa có"}>✦</span>;
  }

  return (
    <img
      {...props}
      className={className}
      src={usableSources[sourceIndex]}
      alt={alt}
      onError={() => {
        if (sourceIndex < usableSources.length - 1) setSourceIndex((current) => current + 1);
        else setFailed(true);
      }}
    />
  );
}
