import { useState, useEffect } from "react";
import { MapPin, Calendar, Clock, Utensils, Train, Camera, BedDouble, ChevronRight, ChevronLeft, Map, Info, AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, Volume2, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Landing() {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [data, setData] = useState<any>(null);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json?t=' + Date.now());
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch data.json", error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-bold">Loading itinerary...</div>;

  const itinerary = data.itinerary;
  const currentDay = itinerary[activeDayIdx];
  const totalDays = itinerary.length;

  const phrasesByDay: Record<number, any[]> = {
    1: [
      { meaning: "예약한 홍길동입니다.", ja: "予約したホン・ギルドン입니다.", pronunciation: "[요야쿠시타 홍기루동데스]" },
      { meaning: "가장 인기 있는 메뉴는 뭔가요?", ja: "一番人気のメニューは何ですか？", pronunciation: "[이치반 닌키노 메뉴-와 난데스카?]" },
      { meaning: "사진 좀 찍어주시겠어요?", ja: "写真を撮ってもらえますか？", pronunciation: "[샤신오 톳테 모라에마스카?]" }
    ],
    2: [
      { meaning: "티켓 교환은 어디서 하나요?", ja: "チケットの交換はどこですか？", pronunciation: "[치켓토노 코우칸와 도코데스카?]" },
      { meaning: "예약 화면 여기 있습니다.", ja: "予約画面、こちらです。", pronunciation: "[요야쿠 가멘, 코치라데스]" },
      { meaning: "시부야 스카이 입구는 어디예요?", ja: "渋谷スカイの入口はどこですか？", pronunciation: "[시부야 스카이노 이리구치와 도코데스카?]" }
    ],
    3: [
      { meaning: "11시 30분 예약 티켓입니다.", ja: "11時30분의 予約チケット입니다.", pronunciation: "[쥬-이지 산쥬-뿐노 요야쿠 치켓토데스]" },
      { meaning: "이거 면세(Tax-free) 되나요?", ja: "これ、免税できますか？", pronunciation: "[코레, 멘제- 데키마스카?]" },
      { meaning: "스카이트리 전망대는 몇 층인가요?", ja: "スカイツリーの展望台は何階ですか？", pronunciation: "[스카이츠리-노 텐보-다이와 난카이데스카?]" }
    ],
    4: [
      { meaning: "빌리브 공연 시간은 언제예요?", ja: "ビリーヴ의 公演時間은 언제입니다?", pronunciation: "[비리-부노 코-엔 지칸와 이츠데스카?]" },
      { meaning: "면세 카운터는 어디에 있나요?", ja: "免税カウンターはどこにありますか？", pronunciation: "[멘제- 카운타-와 도코니 아리마스카?]" },
      { meaning: "체크인은 어디서 하나요?", ja: "チェックインはどこでしますか？", pronunciation: "[젯쿠인와 도코데 시마스카?]" }
    ]
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Hero Section */}
      <div className="relative h-[35vh] overflow-hidden bg-[#2c2c2c]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c2c2c] via-[#2c2c2c]/20 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop" 
          alt="Japan Landscape"
          className="w-full h-full object-cover opacity-60 scale-110"
        />
        <div className="absolute bottom-10 left-0 right-0 z-20 container px-6">
          <Badge className="mb-4 bg-[#bc002d] text-white border-none hover:bg-[#bc002d]/90 px-4 py-1 text-xs uppercase tracking-widest font-bold">나만의 일본 여행</Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white font-jp leading-tight tracking-tight">{data.travel_title}</h1>
          <div className="flex flex-wrap items-center gap-5 text-white/90 mt-4 text-base font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#bc002d]" />
              <span>{data.start_date} 시작</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#bc002d]" />
              <span>도쿄 & 주변 지역</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 max-w-4xl">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-6 mb-10 gap-3 no-scrollbar border-b border-black/5 snap-x">
          {itinerary.map((day: any, idx: number) => (
            <Button
              key={day.day}
              variant={activeDayIdx === idx ? "default" : "outline"}
              onClick={() => setActiveDayIdx(idx)}
              className={`rounded-2xl px-10 transition-all h-14 text-lg font-bold snap-center shrink-0 ${
                activeDayIdx === idx 
                  ? 'bg-[#bc002d] hover:bg-[#bc002d]/90 shadow-xl shadow-[#bc002d]/30 scale-105' 
                  : 'border-black/10 text-black/60 bg-white hover:border-[#bc002d]/30 hover:text-[#bc002d]'
              }`}
            >
              {day.day}일차
            </Button>
          ))}
        </div>

        {/* Day Header */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-black font-jp text-[#2c2c2c] tracking-tighter">{currentDay.day}일차</h2>
              <Badge variant="outline" className="bg-white/80 border-black/10 text-black/80 px-3 py-1 text-sm font-bold shadow-sm">{currentDay.date}</Badge>
            </div>
            <p className="text-xl text-black/60 font-bold leading-snug">✨ {currentDay.theme}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              size="icon" 
              variant="outline" 
              disabled={activeDayIdx === 0}
              onClick={() => setActiveDayIdx(prev => prev - 1)}
              className="rounded-2xl border-black/10 h-14 w-14 bg-white shadow-sm active:scale-95 transition-transform"
            >
              <ChevronLeft className="w-7 h-7" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              disabled={activeDayIdx === totalDays - 1}
              onClick={() => setActiveDayIdx(prev => prev + 1)}
              className="rounded-2xl border-black/10 h-14 w-14 bg-white shadow-sm active:scale-95 transition-transform"
            >
              <ChevronRight className="w-7 h-7" />
            </Button>
          </div>
        </div>

        {/* Timeline Events */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDayIdx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.45rem] before:-z-10 before:h-full before:w-1 before:bg-gradient-to-b before:from-[#bc002d]/40 before:via-[#bc002d]/10 before:to-transparent"
          >
            {currentDay.events.map((event: any, idx: number) => (
              <div key={idx} className="relative pl-14">
                {/* Dot */}
                <div className="absolute left-0 top-3 w-[2.9rem] flex justify-center">
                  <div className="w-4 h-4 rounded-full bg-white border-[3px] border-[#bc002d] shadow-[0_0_0_6px_rgba(188,0,45,0.15)]" />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-black/5 p-7 shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98]">
                  <div className="flex flex-col gap-6">
                    {/* Time & Location */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center text-[#bc002d] font-black text-xl tracking-tight">
                        <Clock className="w-6 h-6 mr-2" />
                        {event.time}
                      </div>
                      <div className="text-2xl font-black text-black/90 flex items-start gap-2 leading-tight">
                        <MapPin className="w-6 h-6 mt-1 text-black/30 shrink-0" />
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#bc002d] transition-colors underline-offset-4 decoration-[#bc002d]/20 active:opacity-70"
                          title="구글 맵에서 열기"
                        >
                          {event.location}
                        </a>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-5">
                      {/* Special Mission for Narita Airport */}
                      {(event.location || "").includes("나리타공항") && (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 shadow-sm">
                          <div className="flex items-center gap-3 text-blue-800 font-black text-lg mb-4">
                            <CheckCircle2 className="w-6 h-6" />
                            <span>공항 필수 미션</span>
                          </div>
                          <Accordion type="single" collapsible className="w-full space-y-2 border-none">
                            <AccordionItem value="item-1" className="border-none bg-white rounded-2xl px-4">
                              <AccordionTrigger className="hover:no-underline py-3 text-blue-950 font-bold text-base">
                                1. 입국 심사
                              </AccordionTrigger>
                              <AccordionContent className="text-blue-900/80 text-sm font-medium leading-relaxed pb-4">
                                Visit Japan Web QR 미리 준비, 'Arrival' 표지판 따라가기.
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-none bg-white rounded-2xl px-4">
                              <AccordionTrigger className="hover:no-underline py-3 text-blue-950 font-bold text-base">
                                2. 수하물 수령
                              </AccordionTrigger>
                              <AccordionContent className="text-blue-900/80 text-sm font-medium leading-relaxed pb-4">
                                1층 이동 후 전광판 확인, 전자 세관 게이트 활용 팁 확인.
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-none bg-white rounded-2xl px-4">
                              <AccordionTrigger className="hover:no-underline py-3 text-blue-950 font-bold text-base">
                                3. 스이카(Suica) 발급 상세 가이드
                              </AccordionTrigger>
                              <AccordionContent className="text-blue-900/80 text-sm font-medium leading-relaxed pb-4 space-y-6">
                                {/* 1. 기계 조작 가이드 */}
                                <div className="space-y-3">
                                  <p className="font-black text-blue-950 text-base flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</div>
                                    무인 발급기 단계별 조작 (T2 지하 1층)
                                  </p>
                                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 space-y-2 font-bold text-blue-900">
                                    <p>① 화면 우측 상단 <span className="text-blue-700">[English]</span> 버튼 클릭</p>
                                    <p>② <span className="text-blue-700">[Purchase new Suica]</span> 메뉴 선택</p>
                                    <p>③ <span className="text-blue-700">[Welcome Suica]</span> 선택 (보증금 500엔 없음)</p>
                                    <p>④ <span className="text-blue-700">[Adult(大人)]</span> 선택 후 인원수 설정</p>
                                    <p>⑤ 충전 금액(권장 2,000엔) 선택 후 현금 투입</p>
                                  </div>
                                </div>

                                {/* Asakusa View Hotel Navigation Guide */}
                                <div className="space-y-3">
                                  <p className="font-black text-blue-950 text-base flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-[#ff9900] text-white flex items-center justify-center text-xs">A</div>
                                    아사쿠사 뷰 호텔 가는 법 (나리타 공항 출발)
                                  </p>
                                  <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 space-y-4 font-bold text-blue-900">
                                    <div className="space-y-2">
                                      <p className="text-orange-900 font-black flex items-center gap-2 text-base">
                                        <Train className="w-5 h-5" />
                                        [추천] 게이세이 나리타 스카이 액세스
                                      </p>
                                      <p className="text-sm pl-7 text-orange-800/80 mb-1 italic">"가장 빠르고 경제적인 가성비 No.1 방법입니다."</p>
                                      <div className="text-sm pl-7 space-y-1">
                                        <p><span className="text-orange-700 font-black">이동 경로:</span> 나리타 공항역 {'->'} <span className="text-orange-600">게이세이 나리타 스카이 액세스선(주황색)</span> 탑승 {'->'} <span className="text-orange-600">아사쿠사역(도영 아사쿠사선)</span> 하차</p>
                                        <p><span className="text-orange-700 font-black">소요 시간:</span> 약 60분</p>
                                        <p><span className="text-orange-700 font-black">요금:</span> 약 1,310엔 ~ 1,372엔</p>
                                        <p className="text-blue-600 flex items-center gap-1 mt-2">
                                          <Info className="w-4 h-4" />
                                          <span className="font-black">꿀팁:</span> 역에서 호텔까지 너무 힘들면 <span className="underline decoration-2">택시</span>를 타세요! (약 5분, 1,000~1,500엔)
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t border-orange-100">
                                      <p className="text-orange-900 font-black flex items-center gap-2 text-base">
                                        <MapPin className="w-5 h-5" />
                                        아사쿠사역(A18)에서 호텔까지 "안심 도보 가이드"
                                      </p>
                                      <div className="space-y-5 text-sm pl-7">
                                        <div className="space-y-1">
                                          <p className="font-black text-blue-950 flex items-center gap-2">1단계: 출구 선택 (가장 중요!)</p>
                                          <ul className="list-disc pl-5 space-y-1 text-blue-900/80 font-medium">
                                            <li><span className="text-orange-600 font-black">추천: A1 출구 (엘리베이터 전용)</span></li>
                                            <li>짐이 많으므로 반드시 엘리베이터를 타고 지상으로 올라오세요.</li>
                                          </ul>
                                        </div>

                                        <div className="space-y-1">
                                          <p className="font-black text-blue-950 flex items-center gap-2">2단계: 가미나리몬 거리 방향 (약 5분)</p>
                                          <ul className="list-disc pl-5 space-y-1 text-blue-900/80 font-medium">
                                            <li>출구 나와서 <span className="font-black text-orange-600">오른쪽</span>으로 꺾어 직진하세요.</li>
                                            <li>큰 사거리에서 <span className="font-black text-orange-600">좌회전</span>하여 <span className="font-bold">가미나리몬 거리(Kaminarimon-dori)</span>로 진입합니다.</li>
                                            <li><span className="text-blue-600 font-black">체크포인트:</span> 오른쪽에 보이는 큰 빨간 등(<span className="font-black text-red-600">가미나리몬</span>)을 지나치며 직진하세요!</li>
                                          </ul>
                                        </div>

                                        <div className="space-y-1">
                                          <p className="font-black text-blue-950 flex items-center gap-2">3단계: 국제거리(Kokusai-dori) 진입 (약 5분)</p>
                                          <ul className="list-disc pl-5 space-y-1 text-blue-900/80 font-medium">
                                            <li>가미나리몬을 지나 계속 직진하면 큰 삼거리가 나옵니다.</li>
                                            <li>여기서 <span className="font-black text-orange-600">우회전</span>하여 <span className="font-bold">국제거리(Kokusai-dori)</span>를 따라 쭉 올라갑니다. (보도가 넓어 캐리어 끌기 좋음)</li>
                                          </ul>
                                        </div>

                                        <div className="space-y-1">
                                          <p className="font-black text-blue-950 flex items-center gap-2">4단계: 호텔 도착</p>
                                          <ul className="list-disc pl-5 space-y-1 text-blue-900/80 font-medium">
                                            <li>왼쪽에 '아사쿠사 ROX' 쇼핑몰을 지나면 높게 솟은 <span className="font-black text-blue-600">아사쿠사 뷰 호텔</span>이 보입니다.</li>
                                            <li><span className="text-blue-600 font-black">도착!</span> 1층 로비에서 체크인을 진행하세요. (17:00 체크인 예정)</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
                                      <p className="text-orange-900 font-black text-xs uppercase tracking-widest mb-3 border-b border-orange-50 pb-2">🗺️ 한눈에 보는 요약도</p>
                                      <div className="text-[11px] font-black text-center text-blue-950 flex items-center justify-between gap-1">
                                        <span className="bg-blue-50 px-2 py-1 rounded flex-1">[아사쿠사역 A1]</span>
                                        <span className="text-orange-400">➡</span>
                                        <span className="bg-orange-50 px-2 py-1 rounded flex-1 leading-tight text-[10px] flex items-center justify-center min-h-[32px]">(우회전 후 사거리 좌회전)</span>
                                        <span className="text-orange-400">➡</span>
                                        <span className="bg-orange-50 px-2 py-1 rounded flex-1 flex items-center justify-center min-h-[32px]">[가미나리몬 거리]</span>
                                        <span className="text-orange-400">➡</span>
                                        <span className="bg-orange-50 px-2 py-1 rounded flex-1 flex items-center justify-center min-h-[32px]">[국제거리]</span>
                                        <span className="text-orange-400">➡</span>
                                        <span className="bg-blue-600 text-white px-2 py-1 rounded flex-1 flex items-center justify-center min-h-[32px] shadow-sm">[호텔 도착]</span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <a 
                                        href="https://papago.naver.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors font-black text-xs"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        파파고 번역기
                                      </a>
                                      <a 
                                        href="https://papago.naver.com/?sk=ko&tk=ja&st=예약한%20것%20체크인%20부탁합니다" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors font-black text-xs"
                                      >
                                        <Volume2 className="w-3.5 h-3.5" />
                                        체크인 음성 듣기
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                {/* 2. 강조 알림창 */}
                                <div className="bg-red-50 p-5 rounded-2xl border-2 border-red-200 shadow-sm">
                                  <div className="flex items-center gap-2 text-red-700 font-black text-base mb-1">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span>중요: 가족 요금 주의사항</span>
                                  </div>
                                  <p className="text-red-600 font-bold text-sm leading-relaxed">
                                    일본은 <span className="underline decoration-2 underline-offset-4">중학생부터 어른 요금</span>이 적용됩니다. 어른 2명과 중학생 1명 가족의 경우, 반드시 <span className="text-red-800 font-black">어른용 카드 3장</span>을 발급받아야 합니다.
                                  </p>
                                </div>

                                {/* 3. 가족 맞춤형 회화 */}
                                <div className="space-y-3">
                                  <p className="font-black text-blue-950 text-base flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</div>
                                    가족 맞춤형 발급 회화
                                  </p>
                                  <div className="overflow-hidden border border-blue-100 rounded-2xl">
                                    <table className="w-full text-left border-collapse bg-white">
                                      <thead>
                                        <tr className="bg-blue-50/50">
                                          <th className="p-3 text-blue-900 font-black text-xs border-b border-blue-100">의미</th>
                                          <th className="p-3 text-blue-900 font-black text-xs border-b border-blue-100">일본어 / 발음 / 듣기</th>
                                        </tr>
                                      </thead>
                                      <tbody className="text-sm">
                                        <tr>
                                          <td className="p-3 border-b border-blue-50 font-bold text-blue-950">성인용 스이카 3장 주세요.</td>
                                          <td className="p-3 border-b border-blue-50">
                                            <div className="flex items-center justify-between gap-2">
                                              <span className="font-black text-base text-black/90 leading-tight">大人用のSuicaを3枚お願いします</span>
                                              <div className="flex gap-1 shrink-0">
                                                <Button size="icon" variant="ghost" className="h-10 w-10 text-blue-600 bg-blue-50" onClick={() => speak("大人用のスイカを三枚お願いします")}>
                                                  <Volume2 className="h-5 h-5" />
                                                </Button>
                                                <a 
                                                  href={`https://papago.naver.com/?sk=ko&tk=ja&st=${encodeURIComponent("성인용 스이카 3장 주세요.")}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="h-10 w-10 flex items-center justify-center rounded-md bg-[#00c73c]/10 text-[#00c73c]"
                                                >
                                                  <Languages className="h-5 h-5" />
                                                </a>
                                              </div>
                                            </div>
                                            <p className="text-blue-600/70 font-bold text-xs mt-1">[오토나 요-노 스이카 오 산마이 오네가이시마스]</p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                {/* 4. 기타 팁 */}
                                <div className="space-y-4 pt-2 border-t border-blue-50">
                                  <div className="space-y-2">
                                    <p className="font-black text-blue-950 text-sm flex items-center gap-2">
                                      <Camera className="w-4 h-4 text-blue-600" />
                                      아이폰(Apple Pay) 사용자 팁
                                    </p>
                                    <p className="text-xs text-blue-900/70 font-medium pl-6">지갑 앱에서 [+] 버튼 {'->'} 교통카드 {'->'} Suica를 선택하여 즉시 발급 가능합니다. 줄 설 필요 없이 현대카드 등으로 즉시 충전 가능해 가장 편리합니다.</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="font-black text-blue-950 text-sm flex items-center gap-2">
                                      <MapPin className="w-4 h-4 text-blue-600" />
                                      JR 서비스 센터 위치
                                    </p>
                                    <p className="text-xs text-blue-900/70 font-medium pl-6">나리타 공항 제2터미널 지하 1층 철도 개찰구 옆 **JR East Travel Service Center**를 찾으세요. 기계 발급이 어려울 때 직원에게 위 회화를 보여주면 도와줍니다.</p>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4" className="border-none bg-white rounded-2xl px-4">
                              <AccordionTrigger className="hover:no-underline py-3 text-blue-950 font-bold text-base">
                                4. 이동 및 길 찾기 회화
                              </AccordionTrigger>
                              <AccordionContent className="text-blue-900/80 text-sm font-medium leading-relaxed pb-4 space-y-4">
                                <div className="overflow-hidden border border-blue-100 rounded-xl">
                                  <table className="w-full text-left border-collapse bg-white">
                                    <thead>
                                      <tr className="bg-blue-50">
                                        <th className="p-3 text-blue-900 font-black text-sm border-b border-blue-100">의미</th>
                                        <th className="p-3 text-blue-900 font-black text-sm border-b border-blue-100">일본어 / 발음</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-base">
                                      <tr>
                                        <td className="p-3 border-b border-blue-50 font-bold text-blue-950">이 열차, 아사쿠사 가나요?</td>
                                        <td className="p-3 border-b border-blue-50">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="font-black text-lg">この電車、浅草に行きますか？</span>
                                            <div className="flex gap-1 shrink-0">
                                              <Button size="icon" variant="ghost" className="h-10 w-10 text-blue-600" onClick={() => speak("この電車、浅草に行きますか？")}>
                                                <Volume2 className="h-6 h-6" />
                                              </Button>
                                              <a 
                                                href={`https://papago.naver.com/?sk=ja&tk=ko&st=${encodeURIComponent("この電車、浅草に行きますか？")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-gray-100 text-[#00c73c]"
                                                title="파파고 상세 보기"
                                              >
                                                <Languages className="h-6 h-6" />
                                              </a>
                                            </div>
                                          </div>
                                          <p className="text-blue-600/70 font-bold text-sm">[코노 덴샤, 아사쿠사니 이키마스카?]</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="p-3 border-b border-blue-50 font-bold text-blue-950">호텔 출구는 어디인가요?</td>
                                        <td className="p-3 border-b border-blue-50">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="font-black text-lg">ホテルの出口はどこですか？</span>
                                            <div className="flex gap-1 shrink-0">
                                              <Button size="icon" variant="ghost" className="h-10 w-10 text-blue-600" onClick={() => speak("ホテルの出口はどこですか？")}>
                                                <Volume2 className="h-6 h-6" />
                                              </Button>
                                              <a 
                                                href={`https://papago.naver.com/?sk=ja&tk=ko&st=${encodeURIComponent("ホテルの出口はどこですか？")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-gray-100 text-[#00c73c]"
                                                title="파파고 상세 보기"
                                              >
                                                <Languages className="h-6 h-6" />
                                              </a>
                                            </div>
                                          </div>
                                          <p className="text-blue-600/70 font-bold text-sm">[호테루노 데구치와 도코데스카?]</p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="p-3 font-bold text-blue-950">여기서 세 번째 역인가요?</td>
                                        <td className="p-3">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="font-black text-lg">ここから3つ目の駅ですか？</span>
                                            <div className="flex gap-1 shrink-0">
                                              <Button size="icon" variant="ghost" className="h-10 w-10 text-blue-600" onClick={() => speak("ここから三つ目の駅ですか？")}>
                                                <Volume2 className="h-6 h-6" />
                                              </Button>
                                              <a 
                                                href={`https://papago.naver.com/?sk=ja&tk=ko&st=${encodeURIComponent("ここから三つ目の駅ですか？")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-gray-100 text-[#00c73c]"
                                                title="파파고 상세 보기"
                                              >
                                                <Languages className="h-6 h-6" />
                                              </a>
                                            </div>
                                          </div>
                                          <p className="text-blue-600/70 font-bold text-sm">[코코카라 밋츠메노 에키데스카?]</p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      )}

                      {/* Activity Icons & Actions */}
                      <div className="flex flex-wrap gap-3">
                        {event.actions?.map((action: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-black/5 text-black/80 border-none font-bold px-4 py-1.5 text-sm rounded-xl">
                            {action}
                          </Badge>
                        ))}
                        {event.spots?.map((spot: string, i: number) => (
                          <Badge key={i} className="bg-[#bc002d]/5 text-[#bc002d] border-[#bc002d]/10 font-bold px-4 py-1.5 text-sm rounded-xl">
                            {spot}
                          </Badge>
                        ))}
                      </div>

                      {/* TRANSPORT HIGHLIGHT (Critical requirement) */}
                      {(event.transport || event.transport_steps) && (
                        <div className="bg-blue-50/80 border border-blue-100 rounded-[2rem] p-6 space-y-4 shadow-inner">
                          <div className="flex items-center gap-3 text-blue-800 font-black text-lg">
                            <Train className="w-6 h-6" />
                            <span>교통편 및 이동 경로</span>
                          </div>
                          
                          {event.transport && (
                            <div className="grid grid-cols-1 gap-5">
                              {event.transport.type && (
                                <div className="bg-white/80 p-4 rounded-2xl border border-blue-100/50 shadow-sm">
                                  <span className="text-blue-900/40 block text-xs uppercase tracking-widest font-black mb-1">이동 수단</span>
                                  <span className="font-black text-lg text-blue-900 leading-tight">{event.transport.type}</span>
                                </div>
                              )}
                              {event.transport.platform && (
                                <div className="bg-[#bc002d] p-5 rounded-2xl shadow-lg shadow-[#bc002d]/20 flex items-center justify-between">
                                  <span className="text-white/70 text-sm font-black uppercase tracking-widest">승강장 번호</span>
                                  <span className="text-3xl font-black text-white px-4">{event.transport.platform}</span>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-4">
                                {event.transport.duration && (
                                  <div className="bg-white/80 p-4 rounded-2xl border border-blue-100/50 shadow-sm">
                                    <span className="text-blue-900/40 block text-xs uppercase tracking-widest font-black mb-1">소요 시간</span>
                                    <span className="font-black text-lg text-blue-900">{event.transport.duration}</span>
                                  </div>
                                )}
                                {event.transport.cost && (
                                  <div className="bg-white/80 p-4 rounded-2xl border border-blue-100/50 shadow-sm">
                                    <span className="text-blue-900/40 block text-xs uppercase tracking-widest font-black mb-1">비용</span>
                                    <span className="font-black text-lg text-blue-900">{event.transport.cost}</span>
                                  </div>
                                )}
                              </div>
                              {event.transport.guide && (
                                <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm">
                                  <span className="text-blue-900/40 block text-xs uppercase tracking-widest font-black mb-2">상세 안내</span>
                                  <span className="text-blue-950 font-bold flex items-start gap-2 text-base leading-relaxed">
                                    <Info className="w-5 h-5 mt-1 shrink-0 text-blue-600" />
                                    {event.transport.guide}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {event.transport_steps && (
                            <div className="space-y-4 bg-white/40 p-5 rounded-2xl border border-blue-100/50">
                              {event.transport_steps.map((step: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 text-base font-bold text-blue-950 leading-snug">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                  {step}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* WARNINGS */}
                          {event.transport?.warning && (
                            <div className="flex items-start gap-3 text-sm text-red-700 bg-red-50 p-4 rounded-2xl border-2 border-red-100 shadow-sm">
                              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                              <span className="font-black leading-tight">주의: {event.transport.warning}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* MEAL OPTIONS */}
                      {event.dinner_options && (
                        <div className="bg-orange-50/80 border border-orange-100 rounded-[2rem] p-6 shadow-sm">
                          <div className="flex items-center gap-3 text-orange-800 font-black text-lg mb-5">
                            <Utensils className="w-6 h-6" />
                            <span>추천 맛집 및 가이드</span>
                          </div>
                          <div className="space-y-4">
                            {event.dinner_options.map((opt: any, i: number) => (
                              <div key={i} className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm space-y-2">
                                <span className="font-black text-lg text-orange-950 block">{opt.name}</span>
                                <p className="text-orange-900/70 text-sm font-bold flex items-start gap-2 leading-relaxed">
                                  <Map className="w-4 h-4 mt-0.5 shrink-0 text-orange-400" />
                                  {opt.guide}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* OTHER DETAILS */}
                      {event.menu && (
                        <div className="bg-black/5 p-5 rounded-2xl border border-black/5">
                          <span className="text-black/40 block text-xs font-black uppercase tracking-widest mb-1">추천 메뉴</span>
                          <span className="text-black/90 font-bold text-lg leading-tight">{event.menu}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Today's Essential Phrases Section */}
        <div className="mt-12 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-blue-100 p-8 shadow-lg shadow-blue-900/5">
            <div className="flex items-center gap-3 text-blue-800 font-black text-2xl mb-6">
              <Volume2 className="w-8 h-8" />
              <span>오늘의 필수 회화 ({currentDay.day}일차)</span>
            </div>
            
            <div className="overflow-hidden border border-blue-100 rounded-2xl">
              <table className="w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="p-4 text-blue-900 font-black text-base border-b border-blue-100">의미</th>
                    <th className="p-4 text-blue-900 font-black text-base border-b border-blue-100">일본어 / 발음</th>
                  </tr>
                </thead>
                <tbody className="text-lg">
                  {(phrasesByDay[currentDay.day] || []).map((phrase, i) => (
                    <tr key={i} className={i !== 2 ? "border-b border-blue-50" : ""}>
                      <td className="p-5 font-bold text-blue-950 leading-tight">
                        {phrase.meaning}
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-black text-xl text-black/90">{phrase.ja}</span>
                          <div className="flex gap-1 shrink-0">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-12 w-12 text-blue-600 bg-blue-50 hover:bg-blue-100 shrink-0" 
                              onClick={() => speak(phrase.ja)}
                            >
                              <Volume2 className="h-6 h-6" />
                            </Button>
                            <a 
                              href={`https://papago.naver.com/?sk=ja&tk=ko&st=${encodeURIComponent(phrase.ja)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="h-12 w-12 flex items-center justify-center rounded-xl bg-[#00c73c]/10 text-[#00c73c] hover:bg-[#00c73c]/20"
                              title="파파고 상세 보기"
                            >
                              <Languages className="h-6 h-6" />
                            </a>
                          </div>
                        </div>
                        <p className="text-blue-600/70 font-bold text-base mt-2">{phrase.pronunciation}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 text-center text-black/20 text-[10px] font-black uppercase tracking-[0.4em]">
          TabiPlan • Your Japan Essential
        </div>
      </div>
    </div>
  );
}
