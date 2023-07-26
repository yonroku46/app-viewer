import { useEffect, useState, Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Policy.scss';

export default function Policy() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const close = searchParams.get('close');

  const [closeFlg, setCloseFlg] = useState<boolean>(false);

  useEffect(() => {
    if (close === 'true') {
      setCloseFlg(true);
    }
  }, []);

  const socialLoginPolicy = {
    title: "【ソーシャルログインポリシー】",
    contents: [
      {
        sectionNo: 1,
        sectionTitle: 'ソーシャルログインについて',
        detail: '当社のWebアプリケーションでは、ソーシャルログイン機能を提供しています。これにより、以下のソーシャルメディアプラットフォームのアカウントを使用して、当アプリケーションにログインおよびアクセスすることができます。',
        sub: ['LINE','Google','その他のソーシャルメディアプラットフォーム' ]
      },{
        sectionNo: 2,
        sectionTitle: 'ユーザーデータの取得',
        detail: 'ソーシャルログインを使用して当社のWebアプリケーションにログインすると、以下のユーザーデータにアクセスします。',
        sub: ['プロフィール情報（名前、写真など）','メールアドレス','その他のソーシャルプラットフォームで提供される公開情報' ]
      },{
        sectionNo: 3,
        sectionTitle: 'ユーザープライバシー',
        detail: '当社は、お客様の個人情報保護を非常に重要視しており、以下の方針に基づいてユーザーデータを取り扱います。',
        sub: [
        'ユーザーデータは厳重に保管され、不正アクセスや不正使用を防止するための適切なセキュリティ対策が講じられます。',
        'ユーザーデータは、当社のプライバシーポリシーに従って適切に取り扱われます。',
        'ユーザーデータは第三者と共有されることはありません（ただし、当社が明示的な同意を得た場合や、法的な要件に基づいて開示する必要がある場合を除く）。',
        'ユーザーデータは、当社のサービスの改善やカスタマイズ、および当社の利用規約に基づくサービス提供のために使用される場合があります。'
        ] 
      },{
        sectionNo: 4,
        sectionTitle: 'Cookieの使用',
        detail: '当社のWebアプリケーションでは、Cookieを使用してユーザーエクスペリエンスの向上やサービスの提供に役立てています。Cookieの使用に関する詳細については、当社のCookieポリシーをご覧ください。'
      }
    ],
  };
  
  const privacyPolicy = {
    title: "【個人情報保護ポリシー】",
    contents: [
      {
        sectionNo: 1,
        sectionTitle: '個人情報の収集と利用',
        detail: '当社のWebアプリケーションでは、お客様から提供される個人情報を以下の目的で収集および利用する場合があります。',
        sub: ['サービス提供とカスタマイズ','ユーザーサポートの提供','サービス改善や新機能の開発','法的要件の遵守']
      },{
        sectionNo: 2,
        sectionTitle: '個人情報の保管とセキュリティ',
        detail: '当社は、お客様の個人情報を適切なセキュリティ対策を講じて保管します。不正アクセス、紛失、改ざん、漏洩などを防止するために、適切な技術的および組織的対策を実施しています。'
      },{
        sectionNo: 3,
        sectionTitle: '第三者への提供',
        detail: '当社は、法的な要件やお客様の明示的な同意を除いて、お客様の個人情報を第三者と共有しません。ただし、以下の場合には必要な範囲で情報提供が行われることがあります。',
        sub: ['当社のサービス提供に関連する委託先との間で情報の共有が必要な場合','法的な要件に基づき情報の開示が必要な場合']
      },{
        sectionNo: 4,
        sectionTitle: '個人情報の開示、訂正、削除',
        detail: 'お客様は、当社に対して自身の個人情報へのアクセス、訂正、削除を要求する権利を有しています。個人情報に関するお問い合わせやリクエストについては、当社のプライバシーポリシーに記載された連絡先までご連絡ください。'
      },{
        sectionNo: 5,
        sectionTitle: 'プライバシーポリシーの変更',
        detail: '当社は、プライバシーポリシーを適宜変更することがあります。重要な変更がある場合は、お客様に適切な方法で通知することを努めます。'
      }
    ]
  };

  return(
    <section className="policy fullsize">
        <div className='sub-title'>
          Operation policy
        </div>
        <div className='title'>
          運用ポリシー
        </div>
      <div className="message">
        <h4>{socialLoginPolicy.title}</h4>
        {socialLoginPolicy.contents.map((content) => (
          <Fragment key={content.sectionNo}>
            <h5>
              {content.sectionNo}.&nbsp;{content.sectionTitle}
            </h5>
            <div>
              {content.detail}
              {content.sub &&
                <ul>
                  {content.sub.map((sub, index) => (
                    <li key={index}>{sub}</li>
                  ))}
                </ul>
              }
            </div>
          </Fragment>
        ))}
        <h4>{privacyPolicy.title}</h4>
        {privacyPolicy.contents.map((content) => (
          <Fragment key={content.sectionNo}>
            <h5>
              {content.sectionNo}.&nbsp;{content.sectionTitle}
            </h5>
            <div>
              {content.detail}
              {content.sub &&
                <ul>
                  {content.sub.map((sub, index) => (
                    <li key={index}>{sub}</li>
                  ))}
                </ul>
              }
            </div>
          </Fragment>
        ))}
      </div>
      {closeFlg ?
        <button className="back-btn" onClick={() => window.close()}>確認</button>
        :
        <button className="back-btn" onClick={() => navigate(-1)}>戻る</button>
      }
    </section>
  )
}