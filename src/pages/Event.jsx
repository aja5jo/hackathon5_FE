import React, { useMemo } from 'react'
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/common/EventCard';
import EventBannerSection from '../components/event/EventBannerSection';
import Footer from '../components/common/Footer';
import dummyEvents from '../assets/dummy.json'

function Event() {
  const categories = dummyEvents?.categories || [];
  const navigate = useNavigate();
  const parse = (s) => (s ? new Date(s) : null);
  const isSameYMD = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const today = new Date();

  const groupedEvents = useMemo(() => {
    const allEvents = categories
      .flatMap((category) => (category?.items || []).map((it) => ({ ...it, category: category.category })))
      .filter((it) => it?.type === 'EVENT');

    const popular = [...allEvents].sort((a, b) => (b?.likeCount ?? 0) - (a?.likeCount ?? 0));
    const ongoing = allEvents.filter((it) => {
      const s = parse(it.startDate);
      const e = parse(it.endDate);
      if (!s || !e) return false;
      return s <= today && today <= e;
    });
    const endingToday = allEvents.filter((it) => {
      const e = parse(it.endDate);
      return !!e && isSameYMD(e, today);
    });
    const upcoming = allEvents
      .filter((it) => {
        const s = parse(it.startDate);
        return !!s && s > today;
      })
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return [
      { key: 'popular', title: '인기', items: popular },
      { key: 'ongoing', title: '진행중', items: ongoing },
      { key: 'endingToday', title: '오늘 마감', items: endingToday },
      { key: 'upcoming', title: '예정', items: upcoming },
    ];
  }, [categories]);

  return (
    <Container>
      <EventBannerSection />

      <Section>
        {groupedEvents.map((section) => (
          <CategorySection key={section.key}>
            <SectionHeader>
              <Subtitle>{section.title}</Subtitle>
              <MoreButton onClick={() => navigate(`/events/more?filter=${section.key}`)}>
                자세히 보기&nbsp;&gt;
              </MoreButton>
            </SectionHeader>
            {section.items.length === 0 && (
              <EmptyState>표시할 이벤트가 없습니다.</EmptyState>
            )}
            <ListContainer>
              {section.items.map((eventItem, idx) => (
                <EventCard key={`${section.key}-${eventItem?.id ?? idx}`} event={eventItem} />
              ))}
            </ListContainer>
          </CategorySection>
        ))}
      </Section>

      <Footer />
    </Container>
  );
}

export default Event


const Container = styled.main`
  padding: 2rem;
`;
const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;
const Subtitle = styled.div`
  color: #262626;
  font-size: 2.6rem;
  font-style: normal;
  font-weight: 600;
  line-height: 32.5px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  //justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
`;

const CategoryButton = styled.button`
  padding: 0.6rem 1.4rem;
  border-radius: 20px;
  border: 2px solid #000;
  background-color: ${props => (props.selected ? ' rgba(254, 229, 32, 0.50);' : 'white')};
  color: ${props => (props.selected ? 'black' : 'black')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;

const CategoryTitle = styled.div`
  color: #262626;
  font-style: normal;
  font-weight: 600;
  line-height: 32.5px; 
  font-size: 2.6rem
  `;


const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  color: #222222;
  font-size: 14px;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #FEE502;
  }
`;


// oneCol prop이 true면 1열, 아니면 기본 auto-fill
const ListContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ oneCol }) => (oneCol ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))')};
  gap: 24px;
  justify-content: center;
  margin-top: 0.5rem;
`;

const EmptyState = styled.div`
  padding: 1rem 0;
  color: #666;
`;
