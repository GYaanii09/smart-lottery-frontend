import Head from "next/head";
import styles from "../styles/Home.module.css";
//import ManualHeader from "../components/ManualHeader";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta nmae="description" content="Our Smart Contarct Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*<ManualHeader />*/}
      <Header />
      <LotteryEntrance />
    </div>
  );
}
