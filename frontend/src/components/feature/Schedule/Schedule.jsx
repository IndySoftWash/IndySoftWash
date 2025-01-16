import { useEffect } from 'react';

const Schedule = () => {
    useEffect(() => {
        // Dynamically load the external script
        const script = document.createElement("script");
        script.src = "https://link.msgsndr.com/js/form_embed.js";
        script.type = "text/javascript";
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
          // Clean up the script when the component unmounts
          document.body.removeChild(script);
        };
    }, []);
    
    return (
        <>
            <iframe
                src="https://api.leadconnectorhq.com/widget/group/qQR9lPsAjNtDBl6sYNUP"
                style={{ width: "100%", border: "none", overflow: "hidden" }}
                scrolling="no"
                id="qQR9lPsAjNtDBl6sYNUP_1735311920333"
                title="Booking Widget"
            ></iframe>
        </>
    );
};

export default Schedule;
