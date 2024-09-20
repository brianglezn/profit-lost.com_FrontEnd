import React, { useState } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { useTranslation } from 'react-i18next';

import './Faq.scss';
import Footer from '../../components/landing/Footer';

const Faq: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useTranslation();

    const faqItems = [
        {
            title: t('landing.faq.questions.q1.title'),
            content: t('landing.faq.questions.q1.content')
        },
        {
            title: t('landing.faq.questions.q2.title'),
            content: t('landing.faq.questions.q2.content')
        },
        {
            title: t('landing.faq.questions.q3.title'),
            content: t('landing.faq.questions.q3.content')
        },
        {
            title: t('landing.faq.questions.q4.title'),
            content: t('landing.faq.questions.q4.content')
        },
        {
            title: t('landing.faq.questions.q5.title'),
            content: t('landing.faq.questions.q5.content')
        },
        {
            title: t('landing.faq.questions.q6.title'),
            content: t('landing.faq.questions.q6.content')
        },
        {
            title: t('landing.faq.questions.q7.title'),
            content: t('landing.faq.questions.q7.content')
        },
        {
            title: t('landing.faq.questions.q8.title'),
            content: t('landing.faq.questions.q8.content')
        }
    ];

    const filteredFaqItems = faqItems.filter(faq =>
        faq.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="faq">
                <h1 className="title">{t('landing.faq.title')}</h1>
                <div className="faq-search">
                    <InputText
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t('landing.faq.search_placeholder')}
                        className="p-inputtext-lg"
                    />
                </div>

                <Accordion multiple>
                    {filteredFaqItems.map((faq, index) => (
                        <AccordionTab key={index} header={faq.title}>
                            <p>{faq.content}</p>
                        </AccordionTab>
                    ))}
                </Accordion>
            </div>
            <Footer />
        </>
    );
};

export default Faq;
