import { Row } from "antd";
import CarouselSlider from "../components/home/CarouselSlider";
import Categories from "../components/home/Categories";
import TopTours from "../components/home/TopTours";
import TopHotels from "../components/home/TopHotels";
import Plan from "../components/home/Plan";

export default function Home() {
  return (
    <>
      <Row
        style={{
          width: "100%",
          height: "110px",
        }}
      ></Row>
      <CarouselSlider />
      <Categories />
      <TopTours />
      <TopHotels />
      <Plan />
    </>
  );
}
