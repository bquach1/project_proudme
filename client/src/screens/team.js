import React from "react";
import "css/team.css";
import styled from "styled-components";
import { useMediaQuery } from "react-responsive";

const TeamWrapper = styled.div`
  font-family: Montserrat;
  padding-bottom: 2%;
`;

const BioRow = styled.div`
  padding-top: 2%;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 90%;
`;

const Bio = styled.div`
  display: flex;
  flex-direction: column;
  width: 27%;
  border-radius: 100%;
  margin: 0 auto;
`;

const BioImage = styled.img`
  border-radius: 100%;
  width: 100%;
  margin-bottom: 2%;
  height: ${(props) =>
    props.isMobile ? "100px" : props.isTablet ? "300px" : "500px"};
  object-fit: cover;
`;

const TeamScreen = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1200px)" });

  return (
    <TeamWrapper style={{ fontSize: isMobile ? "12px" : "16px" }}>
      <h1 style={{ color: "#2E6AA1", marginTop: "1%" }}>Our Team</h1>
      <h3
        style={{
          color: "#2E6AA1",
          marginTop: "2%",
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        Faculty
      </h3>
      <BioRow style={{ marginTop: "1%" }}>
        <Bio>
          <BioImage
            src={require("components/images/team/senlin_chen.png")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Senlin Chen, PhD</strong>
          <strong>
            Helen “Bessie” Silverberg Pliner Professor, School of Kinesiology,
            Louisiana State University.
          </strong>
          <div>
            Dr. Senlin Chen is a Helen “Bessie” Silverberg Pliner Professor in
            the School of Kinesiology (SOK). Dr. Chen’s research is focused on
            physical education curriculum intervention; youth physical activity,
            fitness, and health promotion; achievement motivation in physical
            activity settings; and behavioral and social determinants of health.
            Dr. Chen’s research has been funded by National Institutes of Health
            (NIH), United States Department of Agriculture (USDA), Louisiana
            Department of Health (LDH), Louisiana Board of Regents, Society of
            Health and Physical Educators (SHAPE), and many other sources (&gt;
            $4.5million dollars).
          </div>
        </Bio>
        <Bio>
          <BioImage
            src={require("components/images/team/amanda_staiano.jpeg")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Amanda E. Staiano, PhD</strong>
          <strong>Associate Professor, Pennington Biomedical Research</strong>
          <div>
            Dr. Staiano is a developmental psychologist with an interest in
            family-based healthy lifestyle interventions utilizing innovative
            technology to decrease pediatric obesity and its comorbidities. Her
            research has involved over 1500 children and adolescents, including
            randomized controlled trials and prospective cohorts, to examine the
            influence of physical activity and sedentary behavior on body
            composition and cardiometabolic risk factors.
          </div>
        </Bio>
        <Bio>
          <BioImage
            src={require("components/images/team/richard_rosenkranz.png")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Richard Rosenkranz, PhD</strong>
          <strong>
            Professor/Chair, Department of Kinesiology, and Nutrition Sciences,
            University of Nevada Las Vegas
          </strong>
          <div>
            Rosenkranz’s research has focused on identifying modifiable
            influences of healthy eating and physical activity toward
            developing, evaluating, and scaling up settings- based health
            promotion interventions. Having collaborated with many talented
            colleagues, Rosenkranz has published 118 peer-reviewed scientific
            journal articles. He has also been successful with interdisciplinary
            or transdisciplinary teams in obtaining extramural funding from
            sources including the National Institutes of Health, the U.S.
            Department of Agriculture, several foundations, industry, and
            Australia&#39;s National Health and Medical Research Council.
          </div>
        </Bio>
      </BioRow>
      <BioRow style={{ marginTop: "1%" }}>
        <Bio>
          <BioImage
            src={require("components/images/team/xin_li.png")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Xin (Shane) Li, PhD</strong>
          <strong>
            Professor, Chair, Section of Visual Computing and Interactive Media,
            School of Performance, Visualization, &amp; Fine Arts. Joint
            Faculty, Department of Computer Science and Engineering Aggie
            Computer Graphics Group Texas A&amp;M University
          </strong>
          <div>
            I am a Professor and Chair of the Section of Visual Computing and
            Interactive Media at Texas A&amp;M University, which encompasses the
            joint sections of Visual Computing and Computational Media, as well
            as Technical Art and Interactive Media, within the School of
            Performance, Visualization, and Fine Arts. I am an adjunct faculty
            member (courtesy appointment) of the Department of Computer Science
            and Engineering. I am also affiliated with Aggie Computer Graphics
            Group.
          </div>
        </Bio>
        <Bio>
          <BioImage
            src={require("components/images/team/lsu_logo.jpeg")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Beibei Guo, PhD</strong>
          <strong>
            Assistant Professor, Department of Experimental Statics, LSU
          </strong>
          <div>
            Beibei Guo is an assistant professor in the Department of
            Experimental Statistics at Louisiana State University. She received
            her PhD degree in Statistics from Rice University in 2010. Then she
            joined the Department of Biostatistics, University of Texas M.D.
            Anderson Cancer center, as a postdoctoral fellow. Since August 2013,
            she has been with the Department of Experimental Statistics at LSU.
            Her current research interests include Bayesian clinical trial
            designs, survival analysis, and statistical genomics. She is
            interested in the development of new statistical methods to address
            practical problems in biomedical research.
          </div>
        </Bio>
      </BioRow>
      <h3
        style={{
          color: "#2E6AA1",
          marginTop: "2%",
          textAlign: "center",
          margin: "0 auto",
        }}
      >
        Students
      </h3>
      <BioRow style={{ marginTop: "1%" }}>
        <Bio>
          <BioImage
            src={require("components/images/team/yuxin.png")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Yuxin (Larry) Nie</strong>
          <strong>PhD Researcher</strong>
          <div>
            My name is Yuxin Nie, PhD student working under Dr. Chen at PK Lab
            LSU. I am a former strength and conditioning coach of the Chinese
            rhythmic gymnastic national team. My research field includes public
            health behavior, physical activity and fitness, athletic performance
            and youth health development. I received National Scholarship
            recognition during my time in Beijing Sport University. I hope to
            apply what I learn into practice and help children establish
            lifelong healthy behaviors. In the process of participating in
            ProudMe, I hope to further put theory into practice and enhance
            theoretical learning in practice.
          </div>
        </Bio>
        <Bio>
          <BioImage
            src={require("components/images/team/qiaoyin.png")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Qiaoyin (Joy) Tan</strong>
          <strong>PhD Researcher</strong>
          <div>
            Qiaoyin Tan, known as Joy, holds a master's in education and is
            currently pursuing a Doctor of Philosophy in Kinesiology in LSUPK
            lab. Joy's research spans various areas, including motor injury
            repair and health promotion through sports. She has received
            recognition for her academic achievements, including the National
            Scholarship for University Students and Outstanding Graduate awards.
            Joy's research contributions have been published in reputable
            journals, and she actively participates in academic conferences. Her
            dedication to advancing knowledge in the field of kinesiology
            reflects her passion for health and physical well-being.
          </div>
        </Bio>
        <Bio>
          <BioImage
            src={require("components/images/team/paul.jpeg")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Dongin (Paul) Son</strong>
          <strong>PhD Researcher</strong>
          <div>
            My name is Dongin Son, also referred to as Paul Son. I hold a
            bachelor’s and a master’s degree in Physical Education and am
            currently pursuing my doctoral studies at the PK lab under the
            supervision of Dr. Chen. My research goal is to produce meaningful
            insights that improve the health of adolescents. Specifically, my
            research focuses on the impact of physical activity on health and
            the behavioral and socio-cultural determinants of physical activity.
          </div>
        </Bio>
      </BioRow>
      <BioRow>
        <Bio>
          <BioImage
            src={require("components/images/team/jena.jpg")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Virginia Bordelon</strong>
          <strong>Undergraduate Researcher</strong>
          <div>
            My name is Virginia Bordelon and I am an LSU undergraduate student
            pursuing a degree in Kinesiology. I have a passion for nutrition,
            specifically for the younger generation along with their education.
            I believe that we have a key role in providing essential nutrition,
            physical education, and overall healthy habits for future
            generations to come. I plan on using my degree to be of aid to those
            unable to assist themselves through a career in healthcare. The
            Smarter Lunchroom Scorecard, an application that allows analyzation
            of environments and nutrition in schools, is a major factor in my
            involvement with Project ProudMe.
          </div>
        </Bio>
        <Bio>
          <BioImage
            src={require("components/images/team/rachel.jpeg")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Rachel Hunter</strong>
          <strong>Undergraduate Researcher</strong>
          <div>
            My name is Rachel Hunter and I’m in my second year as an
            undergraduate student at LSU. I am pursuing a degree in Kinesiology
            with the plan to attend Physical Therapy school in the coming years.
            Project Proud Me’s objective is to implement healthier nutrition,
            physical activity, sleep, and screen time habits among middle school
            aged children in and around the greater Baton Rouge area. My passion
            for fitness and health along with my love for young children has
            encouraged my engagement and research in Project Proud Me.
          </div>
        </Bio>
        <Bio>
          <BioImage
            src={require("components/images/team/bruce.jpeg")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Bruce Quach</strong>
          <strong>Web Developer</strong>
          <div>
            My name is Bruce Quach, and I'm currently a senior undergraduate student
            at Louisiana State University majoring in computer science with a
            concentration in software engineering. My primary role in Project
            ProudMe is creating the web application for SMART journaling and
            goal setting and making many of the modules for obesity prevention
            realized on software/mobile applications. I have a passion for web
            development and enjoy watching shows, playing games, and posting on
            my food account in my free time.
          </div>
        </Bio>
      </BioRow>
      <BioRow>
        <Bio>
          <BioImage
            src={require("components/images/team/ashish.jpeg")}
            isMobile={isMobile}
            isTablet={isTablet}
          />
          <strong>Ashish Kumar</strong>
          <strong>AI Developer</strong>
          <div>
            I am a graduate student at Texas A&M University majoring in computer
            Science. I have completed my bachelor degree in Electrical and
            Electronics Engineering from NIT Trichy, India. My research interest
            lies in AI/Machine learning and computer Systems. I love cooking and
            travelling.
          </div>
        </Bio>
      </BioRow>
    </TeamWrapper>
  );
};

export default TeamScreen;
