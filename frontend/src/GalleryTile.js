import React from "react";
import {
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Badge,
  Skeleton,
} from "@mui/material";
import { mutate } from "swr";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function GalleryTile({
  media,
  mediaIdx,
  likes,
  selectMedia,
  showLike,
}) {
  return (
    <ImageListItem
      key={`list-${mediaIdx}`}
      cols={1}
      rows={1}
      onClick={() => {
        media.contentType.indexOf("video") && selectMedia(mediaIdx);
      }}
    >
      {!media ? (
        <Skeleton variant="rect" height="100%" />
      ) : media.contentType.indexOf("video") ? (
        <img src={media.src} alt={media.caption} loading="lazy" />
      ) : (
        <video
          autoPlay
          controls
          muted
          loop
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        >
          <source src={media.src} type={media.contentType} />
          Your browser does not support the video tag.
        </video>
      )}
      {media && (
        <ImageListItemBar
          sx={{ background: "none" }}
          title={media.caption}
          actionIcon={
            showLike && (
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.3)" }}
                disabled={Boolean(localStorage.getItem(media.id))}
                onClick={function (event) {
                  event.stopPropagation();
                  localStorage.setItem(media.id, true);
                  fetch(`/likes?photo=${media.id}`)
                    .then(() => {
                      mutate("/likes");
                    })
                    .catch(() => {
                      localStorage.setItem(media.id, false);
                    });
                }.bind(this)}
              >
                <Badge badgeContent={likes[media.id]}>
                  {localStorage.getItem(media.id) ? (
                    <FavoriteIcon />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </Badge>
              </IconButton>
            )
          }
        />
      )}
    </ImageListItem>
  );
}
