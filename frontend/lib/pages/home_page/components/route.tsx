import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
  Image,
  VStack,
  SimpleGrid,
  Theme,
  useColorMode,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react"
import { CheckIcon, SearchIcon } from "@chakra-ui/icons"

import React from "react"
import { useState, useEffect, useRef } from "react"
import type { ThemeConfig } from "@chakra-ui/react";

import internetComputer from "../../../../assets/internet-computer.jpg"
import GooglePlacesAutocomplete, { geocodeByPlaceId } from "react-google-places-autocomplete"
import { Ride } from ".dfx/local/canisters/gyro/gyro.did";
import { DistanceMatrix, Location } from "../../../../types"
import { FARE } from "../../../../const";

import { useCanister, useConnect } from "@connect2ic/react";


const Route = () => {
  const [currentLocation, setCurrentLocation] = useState("")
  const { colorMode } = useColorMode()
  const [pickUpLocation, setPickUpLocation] = useState<Location>();
  console.log(JSON.stringify(pickUpLocation))
  const [dropLocation, setDropLocation] = useState<Location>();
  const currentLocationRef = useRef<HTMLInputElement>(null)
  const destinationRef = useRef<HTMLInputElement>(null)
  const [ride, setRide] = useState<Ride>()
  const { principal } = useConnect()
  const [loadingData, setLoadingData] = useState(false);


  const { isOpen, onOpen, onClose } = useDisclosure()
  const [gyro] = useCanister("gyro", {
    mode: "anonymous"
  })


  function calcuateAndDisplayRoute(directionsService: google.maps.DirectionsService, directionsDisplay: google.maps.DirectionsRenderer, pointA: google.maps.LatLng, pointB: google.maps.LatLng) {
    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  const mapRef = useRef()
  const confirmRide = () => {
    setRide({
      ...ride,

    })
  }

  return (
    <>
      <Box m={8} >
        <SimpleGrid

          columns={{ base: 1, md: 3 }}
          spacing={{ base: 14, md: 32 }}
          alignContent={{ base: "left", md: "center" }}
          alignSelf={{ base: "left", md: "center" }}

        >

          <GooglePlacesAutocomplete apiKey="AIzaSyBcf-4VVw3jUW0rBTGH8d4IWMhzxppEhKk"
            autocompletionRequest={{
              componentRestrictions: {
                country: ['in']
              }
            }}
            selectProps={{
              theme(theme) {
                return {
                  borderRadius: 4,
                  colors: {
                    ...theme.colors,

                    neutral0: colorMode == "dark" ? "#0033" : "fff",

                  },
                  spacing: theme.spacing
                }
              },
              onChange: (value) => setPickUpLocation(value),
              value: pickUpLocation,
              styles: {
                menu() {
                  return {
                    backgroundColor: "purple"
                  }
                },
                input() {
                  return {
                    color: colorMode == "dark" ? "#fff" : "#000",
                  }
                },
                placeholder() {
                  return {
                    color: colorMode == "dark" ? "#fff" : "#000",
                  }
                },
                singleValue() {
                  return {
                    color: colorMode == "dark" ? "#fff" : "#000",
                  }
                },
                menuPortal() {
                  return {
                    backgroundColor: "black"
                  }
                }
              },


            }}
          />




          <GooglePlacesAutocomplete apiKey="AIzaSyBcf-4VVw3jUW0rBTGH8d4IWMhzxppEhKk"
            autocompletionRequest={{
              componentRestrictions: {
                country: ['in']
              }
            }}
            selectProps={{
              theme(theme) {
                return {
                  borderRadius: 4,
                  colors: {
                    ...theme.colors,

                    neutral0: colorMode == "dark" ? "#0033" : "fff",

                  },
                  spacing: theme.spacing
                }
              },
              onChange: (value) => setDropLocation(value),
              value: dropLocation,
              styles: {
                menu() {
                  return {
                    backgroundColor: "purple"
                  }
                },
                input() {
                  return {
                    color: colorMode == "dark" ? "#fff" : "#000",
                  }
                },
                placeholder() {
                  return {
                    color: colorMode == "dark" ? "#fff" : "#000",
                  }
                },
                singleValue() {
                  return {
                    color: colorMode == "dark" ? "#fff" : "#000",
                  }
                },
                menuPortal() {
                  return {
                    backgroundColor: "black"
                  }
                }
              },
            }}
          />



          <Button onClick={async () => {
            setLoadingData(true)
            const pickUpGeoDatas = await geocodeByPlaceId(
              pickUpLocation.value.place_id
            )
            const dropGeoDatas = await geocodeByPlaceId(
              dropLocation.value.place_id
            );

            onOpen()

            const distance = await new google.maps.DistanceMatrixService().getDistanceMatrix(
              {
                origins: [pickUpGeoDatas[0].formatted_address],
                destinations: [dropGeoDatas[0].formatted_address],
                travelMode: google.maps.TravelMode.DRIVING
              }
            )
            const pointA = new google.maps.LatLng(
              pickUpGeoDatas[0].geometry.location.lat(),
              pickUpGeoDatas[0].geometry.location.lng()
            );
            const pointB = new google.maps.LatLng(
              dropGeoDatas[0].geometry.location.lat(),
              dropGeoDatas[0].geometry.location.lng()
            );
            let mapOptions = {
              zoom: 7,
              center: pointA
            }
            console.log(document.getElementById('map-canvas'), "canvas")
            let map = new google.maps.Map(mapRef.current, mapOptions)
            let directionService = new google.maps.DirectionsService();
            let directionDisplay = new google.maps.DirectionsRenderer({ map: map })
            let fare = FARE;
            calcuateAndDisplayRoute(directionService, directionDisplay, pointA, pointB)

            setRide({
              distance: BigInt(distance.rows[0].elements[0].distance.value),
              dropLocation: dropLocation.label.toString(),
              pickUpLocation: pickUpLocation.label.toString(),
              fare: fare,
              user: principal,
              pickUpLocationCoordinates: {
                latitude: pickUpGeoDatas[0].geometry.location.lat().toString(),
                longitude: pickUpGeoDatas[0].geometry.location.lng().toString(),
              },
              dropLocationCoordinates: {
                latitude: dropGeoDatas[0].geometry.location.lat().toString(),
                longitude: dropGeoDatas[0].geometry.location.lng().toString()
              }
            })
            setLoadingData(false)

          }} isLoading={loadingData}>Search Car</Button>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Modal Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>

                {ride ? <> <Text fontSize='xl'> From {ride.pickUpLocation}</Text>
                  <Center><Text fontSize={'3xl'}> To </Text></Center>
                  <Text fontSize={'xl'}>To {ride.dropLocation}</Text>
                  <Text fontSize={'xl'}>
                    With Distance {ride.distance.toString()} kM {"  "}
                    And Fare <Text color={"red"}>{ride.fare.toString()} ICP </Text>
                  </Text>
                </> : <Spinner size={"lg"} />}
                <div id="map-canvas" ref={mapRef} style={{
                  width: "100%",
                  height: "300px"
                }}></div>

              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Close
                </Button>
                <Button variant='ghost' color={"green"} onClick={confirmRide}>Confirm</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </SimpleGrid>
      </Box>
      <Center py={6}>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={{ base: 14, md: 32 }}
          p={10}
        >
          <Box
            maxW={"330px"}
            w={"full"}
            bg={useColorModeValue("white", "gray.800")}
            rounded={"3xl"}
            overflow={"hidden"}
          >
            <Image src={internetComputer} />
            <Box px={6} py={10}>
              <VStack spacing={4} align="left">
                <Text fontSize="32" fontWeight="bold">
                  Fair Fares
                </Text>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    5.000 page views
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 1
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 2
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 3
                  </ListItem>
                </List>
              </VStack>
            </Box>
          </Box>
          <Box
            maxW={"330px"}
            w={"full"}
            bg={useColorModeValue("white", "gray.800")}
            rounded={"3xl"}
            overflow={"hidden"}
          >
            <Image src={internetComputer} />
            <Box px={6} py={10}>
              <VStack spacing={4} align="left">
                <Text fontSize="32" fontWeight="bold">
                  Zero Convinience Fee
                </Text>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 1
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 2
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 3
                  </ListItem>
                </List>
              </VStack>
            </Box>
          </Box>
          <Box
            maxW={"330px"}
            w={"full"}
            bg={useColorModeValue("white", "gray.800")}
            // boxShadow={'2xl'}
            rounded={"3xl"}
            overflow={"hidden"}
          >
            <Image src={internetComputer} />
            <Box px={6} py={10}>
              <VStack spacing={4} align="left">
                <Text fontSize="32" fontWeight="bold">
                  Peer - Peer
                </Text>
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 1
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 2
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckIcon} color="green.400" />
                    point 3
                  </ListItem>
                </List>
              </VStack>
            </Box>
          </Box>
        </SimpleGrid>
      </Center>
    </>
  )
}
export default Route
