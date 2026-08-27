import { useState } from "react";

export function useServerFilter(emptyCondition) {
    const [condition, setCondition] = useState(emptyCondition);
    const [draftCondition, setDraftCondition] = useState(emptyCondition);
    const [filterOpen, setFilterOpenState] = useState(false);

    const applyCondition = (nextCondition) => {
        setCondition(nextCondition);
    };

    // 텍스트 인풋용: draft에만 반영, "적용" 눌러야 실제 조건에 반영
    const handleDraftChange = (event) => {
        const { name, value } = event.target;
        setDraftCondition((prev) => ({ ...prev, [name]: value }));
    };

    // 셀렉트용: draft 갱신과 동시에 즉시 조건 적용
    const handleImmediateChange = (name, value) => {
        const next = { ...condition, [name]: value };
        setDraftCondition(next);
        applyCondition(next);
    };

    // 팝오버가 열릴 때마다 draft를 현재 조건으로 동기화
    const setFilterOpen = (open) => {
        setFilterOpenState(open);
        if (open) setDraftCondition(condition);
    };

    const submitDraft = (event) => {
        event.preventDefault();
        applyCondition(draftCondition);
        setFilterOpenState(false);
    };

    const reset = () => {
        setDraftCondition(emptyCondition);
        applyCondition(emptyCondition);
        setFilterOpenState(false);
    };

    return {
        condition,
        draftCondition,
        filterOpen,
        setFilterOpen,
        handleDraftChange,
        handleImmediateChange,
        submitDraft,
        reset,
    };
}