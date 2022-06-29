export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

enum CFITypes {
  avatar = "avatar",
}

export function cfimg(imageId: string, variant?: CFITypes) {
  return `https://imagedelivery.net/LZ5Wm7WfanvXV99mi0qkuQ/${imageId}/${
    variant ? variant : "public"
  }`;
}