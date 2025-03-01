/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */
import {
    chakra,
    Box,
    Flex,
    Stack,
    Heading,
    Text,
    Container,
    Input,
    Button,
    SimpleGrid,
    Avatar,
    // AvatarGroup,
    useBreakpointValue,
    useColorModeValue,
    Icon,
    useToast,
    ButtonGroup,
    FormControl,
    FormHelperText,
    FormLabel,
    GridItem,
    // IconProps,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Progress,
    Select,
    Textarea,
  } from "@chakra-ui/react";
  import React, { useState } from "react";
  import Axios from "axios"
  import { Driver,User, Status, _SERVICE } from '.dfx/local/canisters/gyro/gyro.did';
  import { useCanister, useClient, useConnect } from '@connect2ic/react';
  import GyroConnectButton from '../../../components/button/ConnectButton';
  
  const testimonials = [
    {
      name: "Brandon P.",
      role: "Chief Marketing Officer",
      content:
        "It really saves me time and effort. It is exactly what our business has been lacking. EEZY is the most valuable business resource we have EVER purchased. After using EEZY my business skyrocketed!",
      avatar:
        "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
    },
    {
      name: "Krysta B.",
      role: "Entrepreneur",
      content:
        "I didn't even need training. We've used EEZY for the last five years. I have gotten at least 50 times the value from EEZY. I made back the purchase price in just 48 hours!",
      avatar:
        "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
    },
    {
      name: "Darcy L.",
      role: "Movie star",
      content:
        "Thank you for making it painless, pleasant and most of all, hassle free! I'm good to go. No matter where you go, EEZY is the coolest, most happening thing around! I love EEZY!",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80",
    },
    {
      name: "Daniel T.",
      role: "Musician",
      content:
        "I am so pleased with this product. EEZY is both attractive and highly adaptable. Without EEZY, we would have gone bankrupt by now. Thank you for creating this product!",
      avatar:
        "https://images.unsplash.com/photo-1606513542745-97629752a13b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80",
    },
  ];
  
  interface TestimonialCardProps {
    name: string;
    role: string;
    content: string;
    avatar: string;
  }
  
  function TestimonialCard(props: TestimonialCardProps) {
    const { name, role, content, avatar } = props;
    return (
      <Flex
        boxShadow="lg"
        maxW="640px"
        direction={{ base: "row", md: "column" }}
        width="full"
        rounded="xl"
        p={10}
        justifyContent="space-between"
        position="relative"
        bg={useColorModeValue("white", "gray.800")}
        _after={{
          content: '""',
          position: "absolute",
          height: "21px",
          width: "29px",
          left: "35px",
          top: "-10px",
          backgroundSize: "cover",
          backgroundImage: `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='21' viewBox='0 0 29 21' fill='none'%3E%3Cpath d='M6.91391 21C4.56659 21 2.81678 20.2152 1.66446 18.6455C0.55482 17.0758 0 15.2515 0 13.1727C0 11.2636 0.405445 9.43939 1.21634 7.7C2.0699 5.91818 3.15821 4.3697 4.48124 3.05454C5.84695 1.69697 7.31935 0.678787 8.89845 0L13.3157 3.24545C11.5659 3.96667 9.98676 4.94242 8.57837 6.17273C7.21266 7.36061 6.25239 8.63333 5.69757 9.99091L6.01766 10.1818C6.27373 10.0121 6.55114 9.88485 6.84989 9.8C7.19132 9.71515 7.63944 9.67273 8.19426 9.67273C9.34658 9.67273 10.4776 10.097 11.5872 10.9455C12.7395 11.7939 13.3157 13.1091 13.3157 14.8909C13.3157 16.8848 12.6542 18.4121 11.3311 19.4727C10.0508 20.4909 8.57837 21 6.91391 21ZM22.5982 21C20.2509 21 18.5011 20.2152 17.3488 18.6455C16.2391 17.0758 15.6843 15.2515 15.6843 13.1727C15.6843 11.2636 16.0898 9.43939 16.9007 7.7C17.7542 5.91818 18.8425 4.3697 20.1656 3.05454C21.5313 1.69697 23.0037 0.678787 24.5828 0L29 3.24545C27.2502 3.96667 25.6711 4.94242 24.2627 6.17273C22.897 7.36061 21.9367 8.63333 21.3819 9.99091L21.702 10.1818C21.9581 10.0121 22.2355 9.88485 22.5342 9.8C22.8756 9.71515 23.3238 9.67273 23.8786 9.67273C25.0309 9.67273 26.1619 10.097 27.2715 10.9455C28.4238 11.7939 29 13.1091 29 14.8909C29 16.8848 28.3385 18.4121 27.0155 19.4727C25.7351 20.4909 24.2627 21 22.5982 21Z' fill='%239F7AEA'/%3E%3C/svg%3E")`,
        }}
        _before={{
          content: '""',
          position: "absolute",
          zIndex: "-1",
          height: "full",
          maxW: "640px",
          width: "full",
          filter: "blur(40px)",
          transform: "scale(0.98)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          top: 0,
          left: 0,
          // backgroundImage: backgrounds[index % 4],
        }}
      >
        <Flex direction="row" textAlign="left" justifyContent="space-between">
          <chakra.p fontFamily="Inter" fontWeight="medium" fontSize="15px" pb={4}>
            {content}
          </chakra.p>
          <chakra.p fontFamily="Work Sans" fontWeight="bold" fontSize={14}>
            {name}
            <chakra.span fontFamily="Inter" fontWeight="medium" color="gray.500">
              {" "}
              - {role}
            </chakra.span>
          </chakra.p>
        </Flex>
        <Avatar
          src={avatar}
          height="80px"
          width="80px"
          alignSelf="center"
          m={{ base: "0 0 35px 0", md: "0 0 0 50px" }}
        />
      </Flex>
    );
  }
  
  const Form1 = () => {
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    const [user, setUser] = useState<User>({
      email: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      status: { 'User': null } as Status
    });
    const { isConnected, principal } = useConnect()
    console.log({ principal })
    const [gyro, { error, loading, canisterDefinition }] = useCanister("gyro", {
      mode: "anonymous"
    })
    return (
      <>
        <Heading
          w="100%"
          textAlign="center"
          fontWeight="normal"
          mb="2%"
          color="gray.800"
        >
          Driver Registration
        </Heading>
        <Flex>
          <FormControl mr="5%" color="gray.800">
            <FormLabel htmlFor="first-name" fontWeight="normal" color="gray.800">
              First name
            </FormLabel>
            <Input
              value={user.firstName}
              onChange={(e) => setUser({
                ...user,
                firstName: e.target.value
              })}
              type="text" placeholder="John" focusBorderColor='#ffff' borderColor="gray.800"
            />
          </FormControl>
  
          <FormControl color="gray.800">
            <FormLabel htmlFor="last-name" fontWeight="normal" color="gray.800">
              Last name
            </FormLabel>
            <Input
              value={user.lastName}
              onChange={(e) => setUser({
                ...user,
                lastName: e.target.value
              })}
              type="text" placeholder="Doe" borderColor="gray.800"
            />
          </FormControl>
        </Flex>
        <FormControl mt="2%" color="gray.800">
          <FormLabel htmlFor="email" fontWeight="normal" color="gray.800">
            Email address
          </FormLabel>
          <Input 
          value={user.email}
          onChange={(e) => setUser({
            ...user,
            email: e.target.value
          })}
          type="email" placeholder="nithin@gmail.com" borderColor="gray.800"

          />
        </FormControl>
  
        <FormControl mt="2%" color="gray.800">
          <FormLabel htmlFor="mobile" fontWeight="normal" color="gray.800">
            Phone Number
          </FormLabel>
          <Input 
          value = {user.mobileNumber}
          onChange={(e) => setUser({
            ...user,
            mobileNumber: e.target.value
          })}
          type="number"
          placeholder="XXXXXXXXXX"
           borderColor="gray.800" />
        </FormControl>
  
        {/* <FormControl color="gray.800">
          <FormLabel
            htmlFor="password"
            fontWeight="normal"
            mt="2%"
            color="gray.800"
          >
            Password
          </FormLabel>
          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              borderColor="gray.800"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl> */}
      </>
    );
  };
  
  const Form2 = () => {
    return (
      <>
        <Heading w="100%" textAlign="center" fontWeight="normal" color="gray.800">
          Please Upload Required Documents
        </Heading>
        <SimpleGrid columns={1} spacing={6}>
          <FormControl color="gray.800" isRequired>
            <FormLabel htmlFor="license" fontWeight="normal" color="gray.800">
              Driver License
            </FormLabel>
            <Input
              id="licence"
              type="file"
              placeholder="Driver License"
              borderColor="gray.800"
            />
          </FormControl>
          <FormControl color="gray.800" isRequired>
            <FormLabel
              htmlFor="Vehicle Papers"
              fontWeight="normal"
              color="gray.800"
            >
              Vehicle Document
            </FormLabel>
            <Input
              id="Vehicle Papers"
              type="file"
              placeholder="Vehicle Papers"
              borderColor="gray.800"
            />
          </FormControl>
        </SimpleGrid>
      </>
    );
  };

  export default function DriverSignup() {
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(50);
    return (
      <Box w="100%" h="100%" bgGradient="linear(to-l,  gray.700, #4F0079)">
        <Box position="relative">
          <Container
            as={SimpleGrid}
            maxW="7xl"
            // columns={{ base: 1, md: 2 }}
            spacing={{ base: 10, lg: 14 }}
            py={{ base: 10, sm: 10, lg: 10 }}
            // m={{ base: 10, sm: 10, lg: 10 }}
          >
            <Box
              bg="gray.50"
              rounded="xl"
              p={{ base: 4, sm: 6, md: 8 }}
              maxW={{ lg: "lg" }}
              mx={{ base: 10, sm: 14, lg: 96 }}
            >
              <Stack spacing={4}>
                <Heading
                  color="gray.800"
                  lineHeight={1.1}
                  fontSize={{ base: "xl", sm: "xl", md: "2xl" }}
                >
                  One Step Away to Join Our Driver's Community
                </Heading>
                <Progress hasStripe value={progress} mb="5%" mx="5%" isAnimated />
                {step === 1 ? <Form1 /> : <Form2 />}
                <ButtonGroup mt="5%" w="100%">
                  <Flex w="100%" justifyContent="space-between">
                    <Flex>
                      <Button
                        onClick={() => {
                          setStep(step - 1);
                          setProgress(progress - 50);
                        }}
                        isDisabled={step === 1}
                        colorScheme="purple"
                        variant="solid"
                        w="7rem"
                        mr="5%"
                      >
                        Back
                      </Button>
                      <Button
                        w="7rem"
                        isDisabled={step === 2}
                        onClick={() => {
                          setStep(step + 1);
                          if (step === 2) {
                            setProgress(100);
                          } else {
                            setProgress(progress + 50);
                          }
                        }}
                        colorScheme="purple"
                        variant="solid"
                      >
                        Next
                      </Button>
                    </Flex>
                    {step === 2 ? (
                      <Button
                        w="7rem"
                        colorScheme="red"
                        variant="solid"
                        onClick={() => {
                          toast({
                            title: "Account created.",
                            description: "We've created your account for you.",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                          });
                        }}
                      >
                        Submit
                      </Button>
                    ) : null}
                  </Flex>
                </ButtonGroup>
              </Stack>
            </Box>
            <Flex
              textAlign="center"
              // pt={10}
              justifyContent="center"
              direction="column"
              width="full"
              overflow="hidden"
            >
              <Box
                width={{ base: "full", sm: "full", lg: "full" }}
                // margin="auto"
              >
                <chakra.h2
                  fontSize={48}
                  fontFamily="Work Sans"
                  fontWeight="bold"
                  color={useColorModeValue("white", "white")}
                >
                  What Drivers talk about GYRO
                </chakra.h2>
              </Box>
              <SimpleGrid
                columns={{ base: 1, xl: 2 }}
                spacing="20"
                mt={16}
                mb={16}
                mx="auto"
              >
                {testimonials.map((cardInfo) => (
                  <TestimonialCard {...cardInfo} />
                ))}
              </SimpleGrid>
              <Box>
                <Icon viewBox="0 0 40 35" mt={14} boxSize={10} color="purple.400">
                  <path
                    fill="currentColor"
                    d="M10.7964 5.04553e-07C8.66112 -0.000123335 6.57374 0.632971 4.79827 1.81922C3.0228 3.00547 1.63898 4.69158 0.82182 6.66433C0.00466116 8.63708 -0.209132 10.8079 0.207477 12.9021C0.624087 14.9964 1.65239 16.9201 3.16233 18.4299L19.1153 34.3828C19.2395 34.5074 19.3871 34.6062 19.5496 34.6736C19.7121 34.741 19.8863 34.7757 20.0622 34.7757C20.2381 34.7757 20.4123 34.741 20.5748 34.6736C20.7373 34.6062 20.8848 34.5074 21.0091 34.3828L36.962 18.4272C38.9319 16.3917 40.0228 13.6636 39.9996 10.8311C39.9764 7.99858 38.8409 5.28867 36.838 3.28573C34.835 1.28279 32.1251 0.147283 29.2926 0.124081C26.4601 0.100879 23.732 1.19184 21.6965 3.1617L20.0622 4.79337L18.4305 3.1617C17.4276 2.15892 16.237 1.36356 14.9267 0.821064C13.6163 0.278568 12.2119 -0.000433066 10.7937 5.04553e-07H10.7964Z"
                  />
                </Icon>
              </Box>
            </Flex>
          </Container>
        </Box>
        </Box>
    );
}
