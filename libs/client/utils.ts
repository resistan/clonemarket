export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function cfimg(imageId: string, variant?: string) {
  return `https://imagedelivery.net/LZ5Wm7WfanvXV99mi0qkuQ/${imageId}/${
    variant ? variant : "public"
  }`;
}
