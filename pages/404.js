// 404.js
import Container from "@modules/common/components/container/container";
import Link from "next/link";

export default function FourOhFour() {
  return (
    <Container>
      <div className="flex flex-col justify-center items-center pt-[86px] md:pt-[130px]">
        <h1 className="text-[120px] lg:text-[250px] font-bold" style={{color:'#9999'}}>404</h1>
        <span className="text-[28px] lg:text-[32px] font-bold" style={{color:'#9999'}}>Страница не существует</span><br/>
        <Link href="/">
          <a className="text-blue text-xl font-semibold hover:text-bluedeep">Перейти на главную →</a>
        </Link>
      </div>
    </Container>
  );
}
