import React, { useState, useEffect } from 'react';

export default function ContractPopup({ visible, onClose }) {
    const [checkedItems, setCheckedItems] = useState([false, false, false, false, false, false]);

    useEffect(() => {
        if (!visible) {
            setCheckedItems([false, false, false, false, false, false]);
        }
    }, [visible]);

    if (!visible) return null;

    const allChecked = checkedItems.every(Boolean);

    const handleCheck = (index) => {
        const newChecked = [...checkedItems];
        newChecked[index] = !newChecked[index];
        setCheckedItems(newChecked);
    };

    const handleConfirm = () => {
        if (allChecked) onClose();
    };

    return (
        <div id="contract-popup">
            <div className="contract-overlay" onClick={onClose}></div>
            <div className="contract-popup-box animate-popup">
                <h2 className="contract-title">— 委託合約內容 —</h2>
                <ul className="contract-terms">
                    <li><label><input type="checkbox" checked={checkedItems[0]} onChange={() => handleCheck(0)} /> 了解「買斷」代表委託人擁有該作品的財產權，可用於商業或二次授權。</label></li>
                    <li><label><input type="checkbox" checked={checkedItems[1]} onChange={() => handleCheck(1)} /> 未買斷情況下限個人使用，畫師保有完整著作財產權與署名權。</label></li>
                    <li><label><input type="checkbox" checked={checkedItems[2]} onChange={() => handleCheck(2)} /> 商用作品須加價；未註明用途將視為個人用途處理。</label></li>
                    <li><label><input type="checkbox" checked={checkedItems[3]} onChange={() => handleCheck(3)} /> 接受畫面與成品含浮水印展示於作品集中，若需私密交稿需提前聲明並支付買斷費用。</label></li>
                    <li><label><input type="checkbox" checked={checkedItems[4]} onChange={() => handleCheck(4)} /> 理解委託流程與修改次數規則，超出次數將酌收費用。</label></li>
                    <li><label><input type="checkbox" checked={checkedItems[5]} onChange={() => handleCheck(5)} /> 委託過程中請勿催稿、騷擾或另作修改後上傳作品（包含 AI 軟體處理）。</label></li>
                </ul>
                <div className="contract-warning">
                    ⚠️ 請完整勾選並勾選以上所有條款後再進行委託。
                </div>
                <button
                    id="contract-confirm"
                    className={`contract-btn${allChecked ? ' active' : ''}`}
                    disabled={!allChecked}
                    onClick={handleConfirm}
                >
                    我已閱讀並同意
                </button>
            </div>
        </div>
    );
}

