import React, { useState, useEffect } from "react";
import { Container, Text, VStack, Box, Button, Input, HStack } from "@chakra-ui/react";
import ReactPlayer from "react-player";
import { FaPlay, FaPause, FaStop } from "react-icons/fa";

const Index = () => {
  const [audioUrl, setAudioUrl] = useState("");
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleSubtitleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parsedSubtitles = parseSRT(text);
        setSubtitles(parsedSubtitles);
      };
      reader.readAsText(file);
    }
  };

  const parseSRT = (data) => {
    const regex = /(\d+)\s+(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\s+([\s\S]*?)(?=\n\n|\n*$)/g;
    let match;
    const result = [];
    while ((match = regex.exec(data)) !== null) {
      result.push({
        id: match[1],
        startTime: parseTime(match[2]),
        endTime: parseTime(match[3]),
        text: match[4].replace(/\n/g, " "),
      });
    }
    return result;
  };

  const parseTime = (time) => {
    const parts = time.split(/[:,]/);
    return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10) + parseInt(parts[3], 10) / 1000;
  };

  useEffect(() => {
    const subtitle = subtitles.find((sub) => playedSeconds >= sub.startTime && playedSeconds <= sub.endTime);
    setCurrentSubtitle(subtitle ? subtitle.text : "");
  }, [playedSeconds, subtitles]);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Audio and Subtitle Player</Text>
        <HStack spacing={4} width="100%">
          <Input type="file" accept="audio/*" onChange={handleAudioUpload} />
          <Input type="file" accept=".srt" onChange={handleSubtitleUpload} />
        </HStack>
        {audioUrl && (
          <Box width="100%">
            <ReactPlayer url={audioUrl} playing={playing} onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)} controls width="100%" height="50px" />
            <HStack spacing={4} justifyContent="center" mt={4}>
              <Button onClick={() => setPlaying(true)} leftIcon={<FaPlay />}>
                Play
              </Button>
              <Button onClick={() => setPlaying(false)} leftIcon={<FaPause />}>
                Pause
              </Button>
              <Button
                onClick={() => {
                  setPlaying(false);
                  setPlayedSeconds(0);
                }}
                leftIcon={<FaStop />}
              >
                Stop
              </Button>
            </HStack>
          </Box>
        )}
        <Box mt={4} p={4} borderWidth="1px" borderRadius="md" width="100%">
          <Text>{currentSubtitle}</Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
