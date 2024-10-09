// prisma/seed.js

import prisma from '../lib/prisma.js';

async function main() {
  const stems = [
    // Week 1
    {
      weekNumber: 1,
      stems: [
        { text: 'If I bring more awareness to my life today...', order: 1 },
        { text: 'If I take more responsibility for my choices and actions today...', order: 2 },
        { text: 'If I pay more attention to how I deal with people today...', order: 3 },
        { text: 'If I boost my energy level by 5 percent today...', order: 4 },
      ],
    },
    // Week 2
    {
      weekNumber: 2,
      stems: [
        { text: 'If I bring 5 percent more awareness to my important relationships…', order: 1 },
        { text: 'If I bring 5 percent more awareness to my insecurities…', order: 2 },
        { text: 'If I bring 5 percent more awareness to my deepest needs and wants…', order: 3 },
        { text: 'If I bring 5 percent more awareness to my emotions…', order: 4 },
      ],
    },
    // Week 3
    {
      weekNumber: 3,
      stems: [
        { text: 'If I treat listening as a creative act…', order: 1 },
        { text: 'If I notice how people are affected by the quality of my listening…', order: 2 },
        { text: 'If I bring more awareness to my dealings with people today…', order: 3 },
        { text: 'If I commit to dealing with people fairly and benevolently…', order: 4 },
      ],
    },
    // Week 4
    {
      weekNumber: 4,
      stems: [
        { text: 'If I bring a higher level of self-esteem to my activities today…', order: 1 },
        { text: 'If I bring a higher level of self-esteem to my dealings with people today…', order: 2 },
        { text: 'If I am 5 percent more self-accepting today…', order: 3 },
        { text: 'If I am self-accepting even when I make mistakes…', order: 4 },
        { text: 'If I am self-accepting even when I feel confused and overwhelmed…', order: 5 },
      ],
    },
    // Week 5
    {
      weekNumber: 5,
      stems: [
        { text: 'If I am more accepting of my body…', order: 1 },
        { text: 'If I deny and disown my body…', order: 2 },
        { text: 'If I deny or disown my conflicts…', order: 3 },
        { text: 'If I am more accepting of all the parts of me…', order: 4 },
      ],
    },
    // Week 6
    {
      weekNumber: 6,
      stems: [
        { text: 'If I wanted to raise my self-esteem today, I could…', order: 1 },
        { text: 'If I am more accepting of my feelings…', order: 2 },
        { text: 'If I deny and disown my feelings…', order: 3 },
        { text: 'If I am more accepting of my thoughts…', order: 4 },
        { text: 'If I deny and disown my thoughts…', order: 5 },
      ],
    },
    // Week 7
    {
      weekNumber: 7,
      stems: [
        { text: 'If I am more accepting of my fears…', order: 1 },
        { text: 'If I deny and disown my fears…', order: 2 },
        { text: 'If I were more accepting of my pain…', order: 3 },
        { text: 'If I deny and disown my pain…', order: 4 },
      ],
    },
    // Week 8
    {
      weekNumber: 8,
      stems: [
        { text: 'If I am more accepting of my anger…', order: 1 },
        { text: 'If I deny and disown my anger…', order: 2 },
        { text: 'If I am more accepting of my sexuality…', order: 3 },
        { text: 'If I deny and disown my sexuality…', order: 4 },
      ],
    },
    // Week 9
    {
      weekNumber: 9,
      stems: [
        { text: 'If I am more accepting of my excitement…', order: 1 },
        { text: 'If I deny and disown my excitement…', order: 2 },
        { text: 'If I am more accepting of my intelligence…', order: 3 },
        { text: 'If I deny and disown my intelligence…', order: 4 },
      ],
    },
    // Week 10
    {
      weekNumber: 10,
      stems: [
        { text: 'Self-responsibility means…', order: 1 },
        { text: 'If I take 5 percent more responsibility for my life and well-being…', order: 2 },
        { text: 'If I avoid responsibility for my life and well-being…', order: 3 },
        { text: 'If I take 5 percent more responsibility for the attainment of my goals…', order: 4 },
        { text: 'If I avoid responsibility for the attainment of my goals…', order: 5 },
      ],
    },
    // Add more weeks (11-30) here following the same structure
    {
      weekNumber: 11,
      stems: [
        { text: 'If I take 5 percent more responsibility for the success of my relationships…', order: 1 },
        { text: 'Sometimes I keep myself passive when I…', order: 2 },
        { text: 'Sometimes I make myself helpless when I…', order: 3 },
        { text: 'I am becoming aware…', order: 4 },
      ],
    },
    // Week 12
    {
      weekNumber: 12,
      stems: [
        { text: 'If I take 5 percent more responsibility for my standard of living…', order: 1 },
        { text: 'If I take 5 percent more responsibility for my choice of companions…', order: 2 },
        { text: 'If I take 5 percent more responsibility for my personal happiness…', order: 3 },
        { text: 'If I take 5 percent more responsibility for the level of my self-esteem…', order: 4 },
      ],
    },
    // Week 13
    {
      weekNumber: 13,
      stems: [
        { text: 'Self-assertiveness means…', order: 1 },
        { text: 'If I lived 5 percent more assertively today…', order: 2 },
        { text: 'If I treat my thoughts and feelings with respect today…', order: 3 },
        { text: 'If I treat my wants with respect today…', order: 4 },
      ],
    },
    // Week 14
    {
      weekNumber: 14,
      stems: [
        { text: 'If, when I was young, someone had told me my wants really mattered…', order: 1 },
        { text: 'If, when I was young, I had been taught to honor my own life…', order: 2 },
        { text: 'If I treat my life as unimportant…', order: 3 },
        { text: 'If I were willing to say yes when I want to say yes and no when I want to say no…', order: 4 },
        { text: 'If I were willing to let people hear the music inside me…', order: 5 },
        { text: 'If I were to express 5 percent more of who I am…', order: 6 },
      ],
    },
    // Week 15
    {
      weekNumber: 15,
      stems: [
        { text: 'Living purposefully to me means…', order: 1 },
        { text: 'If I bring 5 percent more purposefulness into my life…', order: 2 },
        { text: 'If I operate 5 percent more purposefully at work…', order: 3 },
        { text: 'If I operate 5 percent more purposefully in my relationships…', order: 4 },
        { text: 'If I operate 5 percent more purposefully in marriage…', order: 5 },
      ],
    },
    // Week 16
    {
      weekNumber: 16,
      stems: [
        { text: 'If I operate 5 percent more purposefully with my children…', order: 1 },
        { text: 'If I were 5 percent more purposeful about my deepest yearnings…', order: 2 },
        { text: 'If I take more responsibility for fulfilling my wants…', order: 3 },
        { text: 'If I make my happiness a conscious goal…', order: 4 },
      ],
    },
    // Week 17
    {
      weekNumber: 17,
      stems: [
        { text: 'Integrity means…', order: 1 },
        { text: 'If I look at instances in which I find full integrity difficult…', order: 2 },
        { text: 'If I bring 5 percent more integrity into my life…', order: 3 },
        { text: 'If I bring 5 percent more integrity to my work…', order: 4 },
      ],
    },
    // Week 18
    {
      weekNumber: 18,
      stems: [
        { text: 'If I bring 5 percent more integrity to my relationship…', order: 1 },
        { text: 'If I remain loyal to the values I believe are right…', order: 2 },
        { text: 'If I refuse to live by values I do not respect…', order: 3 },
        { text: 'If I treat my self-respect as a high priority…', order: 4 },
      ],
    },
    // Week 19
    {
      weekNumber: 19,
      stems: [
        { text: 'If the child in me could speak, he/she would say…', order: 1 },
        { text: 'If the teenager I once was still exists inside of me…', order: 2 },
        { text: 'If my teenage self could speak, he/she would say…', order: 3 },
        { text: 'At the thought of reaching back to help my child self…', order: 4 },
        { text: 'At the thought of reaching back to help my teenage self…', order: 5 },
        { text: 'If I could make friends with my younger selves…', order: 6 },
      ],
    },
    // Week 20
    {
      weekNumber: 20,
      stems: [
        { text: 'If my child self felt accepted by me…', order: 1 },
        { text: 'If my teenage self felt I was on his/her side…', order: 2 },
        { text: 'If my younger selves felt I had compassion for their struggles…', order: 3 },
        { text: 'If I could hold my child self in my arms…', order: 4 },
        { text: 'If I could hold my teenage self in my arms…', order: 5 },
        { text: 'If I had the courage and compassion to embrace and love my younger selves…', order: 6 },
      ],
    },
    {
      weekNumber: 21,
      stems: [
        { text: 'Sometimes my child self feels rejected by me when I…', order: 1 },
        { text: 'Sometimes my teenage self feels rejected by me when I…', order: 2 },
        { text: 'One of the things my child self needs from me and rarely gets…', order: 3 },
        { text: 'One of the things my teenage self needs from me and has not received is…', order: 4 },
        { text: 'One of the ways my child self gets back at me for rejecting him/her is…', order: 5 },
        { text: 'One of the ways my teenage self gets back at me for rejecting him/her is…', order: 6 },
      ],
    },
    // Week 22
    {
      weekNumber: 22,
      stems: [
        { text: 'At the thought of giving my child self what he/she needs from me…', order: 1 },
        { text: 'At the thought of giving my teenage self what he/she needs from me…', order: 2 },
        { text: 'If my child self and I were to fall in love…', order: 3 },
        { text: 'If my teenage self and I were to fall in love…', order: 4 },
      ],
    },
    // Week 23
    {
      weekNumber: 23,
      stems: [
        { text: 'If I accept that my child self may need time to learn to trust me…', order: 1 },
        { text: 'If I accept that my teenage self may need time to learn to trust me…', order: 2 },
        { text: 'As I come to understand that my child self and my teenage self are both part of me…', order: 3 },
        { text: 'I am becoming aware…', order: 4 },
      ],
    },
    // Week 24
    {
      weekNumber: 24,
      stems: [
        { text: 'Sometimes when I am afraid, I…', order: 1 },
        { text: 'Sometimes when I am hurt, I…', order: 2 },
        { text: 'Sometimes when I am angry, I…', order: 3 },
        { text: 'An effective way to handle fear might be to…', order: 4 },
        { text: 'An effective way to handle hurt might be to…', order: 5 },
        { text: 'An effective way to handle anger might be to…', order: 6 },
      ],
    },
    // Week 25
    {
      weekNumber: 25,
      stems: [
        { text: 'Sometimes when I am excited, I…', order: 1 },
        { text: 'Sometimes when I am aroused sexually, I…', order: 2 },
        { text: 'Sometimes when I experience strong feelings, I…', order: 3 },
        { text: 'If I make friends with my excitement…', order: 4 },
        { text: 'If I make friends with my sexuality…', order: 5 },
        { text: 'As I grow more comfortable with the full range of my emotions…', order: 6 },
      ],
    },
    // Week 26
    {
      weekNumber: 26,
      stems: [
        { text: 'If I think about becoming better friends with my child self…', order: 1 },
        { text: 'If I think about becoming better friends with my teenage self…', order: 2 },
        { text: 'As my younger selves become more comfortable with me…', order: 3 },
        { text: 'As I create a safe space for my child self…', order: 4 },
        { text: 'As I create a safe space for my teenage self…', order: 5 },
      ],
    },
    // Week 27
    {
      weekNumber: 27,
      stems: [
        { text: 'Mother gave me a view of myself as…', order: 1 },
        { text: 'Father gave me a view of myself as…', order: 2 },
        { text: 'Mother speaks through my voice when I tell myself…', order: 3 },
        { text: 'Father speaks through my voice when I tell myself…', order: 4 },
      ],
    },
    // Week 28
    {
      weekNumber: 28,
      stems: [
        { text: 'If I bring 5 percent more awareness to my relationship with my mother…', order: 1 },
        { text: 'If I bring 5 percent more awareness to my relationship with my father…', order: 2 },
        { text: 'If I look at my mother and father realistically…', order: 3 },
        { text: 'If I reflect on the level of awareness I bring to my relationship with my mother…', order: 4 },
        { text: 'If I reflect on the level of awareness I bring to my relationship with my father…', order: 5 },
      ],
    },
    // Week 29
    {
      weekNumber: 29,
      stems: [
        { text: 'At the thought of being free of Mother psychologically…', order: 1 },
        { text: 'At the thought of being free of Father psychologically…', order: 2 },
        { text: 'At the thought of belonging fully to myself…', order: 3 },
        { text: 'If my life really does belong to me…', order: 4 },
        { text: 'If I really am capable of independent survival…', order: 5 },
      ],
    },
    // Week 30
    {
      weekNumber: 30,
      stems: [
        { text: 'If I bring 5 percent more awareness to my life…', order: 1 },
        { text: 'If I am 5 percent more self-accepting…', order: 2 },
        { text: 'If I bring 5 percent more self-responsibility to my life…', order: 3 },
        { text: 'If I operate 5 percent more self-assertively…', order: 4 },
        { text: 'If I live my life 5 percent more purposefully…', order: 5 },
        { text: 'If I bring 5 percent more integrity to my life…', order: 6 },
        { text: 'If I breathe deeply and allow myself to experience what self-esteem feels like…', order: 7 },
      ],
    }
  ];

  for (const week of stems) {
    for (const stem of week.stems) {
      // Check if the stem already exists to avoid duplicates
      const existingStem = await prisma.sentenceStem.findFirst({
        where: {
          text: stem.text,
          weekNumber: week.weekNumber,
          order: stem.order,
        },
      });

      if (!existingStem) {
        await prisma.sentenceStem.create({
          data: {
            text: stem.text,
            weekNumber: week.weekNumber,
            order: stem.order,
          },
        });
        console.log(`Seeding stem for week ${week.weekNumber}, order ${stem.order}`);
      } else {
        console.log(`Stem for week ${week.weekNumber}, order ${stem.order} already exists.`);
      }
    }
  }

  console.log('Sentence stems seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
