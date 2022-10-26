import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import Box from "@material-ui/core/Box";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import { Skeleton } from "@material-ui/lab";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import { format } from "timeago.js";
import useSWR from "swr";
import useWindowDimensions from "./useWindowDimensions";

const fetcher = (url) => fetch(url).then((r) => r.json());

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "10px",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 1000,
    height: 1000,
  },
}));

export default function TitlebarGridList() {
  const classes = useStyles();
  const windowDimensions = useWindowDimensions();
  const { data, error } = useSWR("/images", fetcher);

  const [index, setIndex] = useState(-1);

  if (error) return <div>failed to load</div>;

  const currentMedium = data[index];

  return (
    <div className={classes.root}>
      <ImageList
        variant="quilted"
        cols={windowDimensions.width > windowDimensions.height ? 5 : 3}
        rowHeight={200}
      >
        {data.map((media, index) =>
          media ? (
            <ImageListItem
              key={`list-${index}`}
              cols={1}
              rows={1}
              onClick={() => {
                media.contentType.indexOf("video") && setIndex(index);
              }}
            >
              {media.contentType.indexOf("video") ? (
                <img src={media.src} alt={media.caption} loading="lazy" />
              ) : (
                <video autoPlay controls muted loop>
                  <source src={media.src} type={media.contentType} />
                  Your browser does not support the video tag.
                </video>
              )}
              {media.caption && <ImageListItemBar title={media.caption} />}
            </ImageListItem>
          ) : (
            <Box
              key={`list-${index}`}
              sx={{
                boxSizing: "border-box",
              }}
            >
              <Skeleton variant="rect" height="100%" />
            </Box>
          )
        )}
      </ImageList>
      {currentMedium && (
        <Lightbox
          mainSrc={currentMedium.src}
          imageCaption={`Sent from ${currentMedium.sender} ${format(
            currentMedium.dateSent,
            "de"
          )}`}
          imageTitle={currentMedium.caption}
          nextSrc={
            (data[(index + data.length - 1) % data.length] || currentMedium).src
          }
          prevSrc={(data[(index + 1) % data.length] || currentMedium).src}
          onCloseRequest={() => setIndex(-1)}
          onMovePrevRequest={() =>
            setIndex((index + data.length - 1) % data.length)
          }
          onMoveNextRequest={() => setIndex((index + 1) % data.length)}
        />
      )}
    </div>
  );
}
