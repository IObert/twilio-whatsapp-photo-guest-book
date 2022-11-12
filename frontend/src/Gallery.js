import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ImageList from "@material-ui/core/ImageList";
import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ImageListItem from "@material-ui/core/ImageListItem";
import ImageListItemBar from "@material-ui/core/ImageListItemBar";
import Alert from "@material-ui/lab/Alert";
import { Skeleton } from "@material-ui/lab";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import { format, register } from "timeago.js";
import deLocal from "timeago.js/lib/lang/de";
import useSWRInfinite from "swr/infinite";
import useWindowDimensions from "./useWindowDimensions";
import useOnScreen from "./useOnScreen";

const fetcher = (url) => fetch(url).then((r) => r.json());
register("de", deLocal);

const getKey = (pageIndex, previousPageData) => {
  if (
    previousPageData &&
    previousPageData.pageSize != previousPageData.images.length
  ) {
    return null; // reached the end
  }
  let key = `/images?page=${pageIndex}`;
  if (pageIndex > 0) {
    key += `&pageToken=${previousPageData.pageToken}`;
  }
  return key;
};

const isLastPageFull = (pages) => {
  const lastPage = pages[pages.length - 1];
  return lastPage.pageSize > lastPage.images.length;
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "10px",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  alert: {
    position: "absolute",
    width: "95%",
    bottom: "10px",
    padding: "10px",
  },
  completed: {
    display: "none",
  },
  loading: {
    marginTop: "2rem",
  },
}));

export default function Gallery() {
  const classes = useStyles();
  const windowDimensions = useWindowDimensions();
  const { data, error, isValidating, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    {
      initialPage: 1,
      revalidateFirstPage: false,
    }
  );
  const refLoader = useRef(null);
  const isOnScreen = useOnScreen(refLoader, "50px");
  window.setSize = setSize;

  useEffect(() => {
    if (isOnScreen && !isValidating) {
      setSize(size + 1);
    }
  }, [isOnScreen, isValidating, size]);

  const [index, setIndex] = useState(-1);

  if (error) {
    return (
      <Alert variant="filled" severity="error" className={classes.alert}>
        Es lief etwas schief :(
      </Alert>
    );
  }

  let images = data
    ? data.map((p) => p.images).flat()
    : [...Array(60)].map(() => null);

  return (
    <div className={classes.root}>
      {!isValidating && data[0].images.length === 0 ? (
        <Typography variant="subtitle1" align="center">
          No images yet :)
        </Typography>
      ) : (
        <ImageList
          variant="quilted"
          // cols={windowDimensions.width > windowDimensions.height ? 2 : 1}
          cols={windowDimensions.width > windowDimensions.height ? 5 : 3}
          // rowHeight={700}
          rowHeight={200}
        >
          {images.map((media, imageIdx) =>
            media ? (
              <ImageListItem
                key={`list-${imageIdx}`}
                cols={1}
                rows={1}
                onClick={() => {
                  media.contentType.indexOf("video") && setIndex(imageIdx);
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
                key={`list-${imageIdx}`}
                sx={{
                  boxSizing: "border-box",
                }}
              >
                <Skeleton variant="rect" height="100%" />
              </Box>
            )
          )}
        </ImageList>
      )}
      {
        <LinearProgress
          ref={refLoader}
          className={
            isValidating || !isLastPageFull(data)
              ? classes.loading
              : classes.completed
          }
        />
      }

      {images[index] && (
        <Lightbox
          mainSrc={images[index].src}
          imageCaption={`Gesendet von ${images[index].sender} ${format(
            images[index].dateSent,
            "de"
          )}`}
          imageTitle={images[index].caption}
          nextSrc={
            (
              images[(index + images.length - 1) % images.length] ||
              images[index]
            ).src
          }
          prevSrc={(images[(index + 1) % images.length] || images[index]).src}
          onCloseRequest={() => setIndex(-1)}
          onMovePrevRequest={() => {
            setIndex((index + images.length - 1) % images.length);
          }}
          onMoveNextRequest={() => {
            if (index > images.length - 4) {
              setSize(size + 1);
            }
            setIndex((index + 1) % images.length);
          }}
        />
      )}
    </div>
  );
}
