import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "Why to join as a Poster",
  desc: "",
  image: benefitOneImg,
  bullets: [
    {
      title: "Must have for Youtubers",
      desc: "Improve your CTR by collecting votes on your thumbnails ",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Train your Gen AI model",
      desc: "Train your AI ML model by labelling your training data",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Decentralized payments",
      desc: "Pay the minions via solana with mininum gas fees",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Why to join as a Minion",
  desc: "",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Earn by clicking",
      desc: "Earn money by labelling data from the posters",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Generate passive income",
      desc: "Make it a part time job along with your full time job",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Decentralized payments",
      desc: "Withdraw your money via crypto anytime you want",
      icon: <SunIcon />,
    },
  ],
};


export {benefitOne, benefitTwo};
