import React, { useState, useRef, useEffect } from "react";
import {
  ImageList, LinearProgress, Box,
  Typography, ImageListItem, ImageListItemBar,
  Alert, Skeleton
} from "@mui/material";


import Viewer from 'react-viewer';

import { format, register } from "timeago.js";

import deLocal from "timeago.js/lib/lang/de";
import useSWRInfinite from "swr/infinite";
import useWindowDimensions from "./useWindowDimensions";
import useOnScreen from "./useOnScreen";

const fetcher = (url) => fetch(url).then((r) => r.json());
register("de", deLocal);

const getKey = (pageIndex, previousPageData) => {
  if (previousPageData && !previousPageData.pageToken) {
    return null; // reached the end
  }
  let key = `/media?page=${pageIndex}`;
  if (pageIndex > 0) {
    key += `&pageToken=${previousPageData.pageToken}`;
  }
  return key;
};

const isLastPage = (pages) => {
  if (!pages) {
    return false;
  }
  const mostRecentPage = pages[pages.length - 1];
  return !mostRecentPage.pageToken;
};

export default function Gallery() {
  const windowDimensions = useWindowDimensions();
  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    {
      initialPage: 1,
      revalidateFirstPage: false,
    }
  );
  const refLoader = useRef(null);
  const isOnScreen = useOnScreen(refLoader, "50px");

  useEffect(() => {
    if (isOnScreen && !isLoading) {
      debugger
      setSize(size + 1);
    }
  }, [isOnScreen, isLoading]);

  const [index, setIndex] = useState(-1);

  if (error) {
    return (
      <Alert variant="filled" severity="error" sx={{
        position: "absolute",
        width: "95%",
        bottom: "10px",
        padding: "10px",
      }}>
        Es lief etwas schief :(
      </Alert>
    );
  }
  const files = data
    ? data.map((p) => p.files).flat()
    : [...Array(60)].map(() => null);

  files.filter(file => file && file.contentType.indexOf("video") === -1).forEach(image => {
    if (image) {
      image.alt = `Send by ${image.sender} ${format(
        image.dateSent)}`;
    }
  })

  return (
    <>
      <Viewer
        visible={index >= 0}
        activeIndex={index}
        onClose={() => { setIndex(-1) }}
        rotatable={false}
        noImgDetails={true}
        scalable={false}
        onMaskClick={() => { setIndex(-1) }}
        zoomSpeed={2}
        images={files}
      />
      <div style={{
        marginTop: "10px",
        width: "100%",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
      }}>
        {!isLoading && data[0].files.length === 0 ? (
          <Typography variant="subtitle1" align="center">
            There Gallery is still empty :)
          </Typography>
        ) : (
          <ImageList
            variant="quilted"
            cols={windowDimensions.width > windowDimensions.height ? 5 : 3}
            rowHeight={200}
          >
            {files.map((media, imageIdx) =>
              <ImageListItem
                key={`list-${imageIdx}`}
                cols={1}
                rows={1}
                onClick={() => {
                  media.contentType.indexOf("video") && setIndex(imageIdx);
                }}
              >
                {!media ? (
                  <Skeleton variant="rect" height="100%" />
                ) : (
                  media.contentType.indexOf("video") ? (
                    <img src={media.src} alt={media.caption} loading="lazy" />
                  ) : (
                    <video autoPlay controls muted loop style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%"
                    }}>
                      <source src={media.src} type={media.contentType} />
                      Your browser does not support the video tag.
                    </video>
                  ))}
                {media && media.caption && <ImageListItemBar title={media.caption} />}
              </ImageListItem>

            )}
          </ImageList>
        )}

        {
          <LinearProgress
            ref={refLoader}
            sx={!isLastPage(data) ? {
              marginTop: "2rem",
            } : {
              display: "none",
            }}
          />
        }


      </div>
    </>
  );
}
