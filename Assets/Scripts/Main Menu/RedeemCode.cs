using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using UnityEngine;
using UnityEngine.UI;

public class RedeemCode : MonoBehaviour {

    private string productCode = "ST-CR"; //change this to whatever code will be needed for the specific game

    public UIInput emailAccountInput;
    public UIInput redeemCodeInput;
    public UIPanel frontPanel;
    public UIPanel redeemPanel;
    public GameObject redeemErrorMessage;
    UITexture background;

    public static bool verified = false;

    public ChallenegeMenu cm;

    // Use this for initialization
    void Start () {
        background = GameObject.FindObjectOfType<UITexture>();
        background.mainTexture = Resources.Load("background_st") as Texture;

        productCode = SimplifyCode(productCode);

        frontPanel.alpha = 0f;
        redeemPanel.alpha = 1f;
        redeemErrorMessage.SetActive(false);

        //PlayerPrefs.SetString("verificationCode", ""); //for testing
        if (SimplifyCode(PlayerPrefs.GetString("verificationCode")).Contains(productCode))
            Verified();
	}
	
	// Update is called once per frame
	void Update () {

	}

    public void TestCode()
    {
        string testCode = SimplifyCode(redeemCodeInput.value);

        if (testCode.Contains(productCode))
        {
            PlayerPrefs.SetString("verificationCode", testCode);
            Debug.Log("code matched: " + testCode);
            Verified();
        }
        else
        {
            Debug.Log("code incorrect: " + testCode);
            redeemPanel.alpha = 0f;
            redeemErrorMessage.SetActive(true);
        }

        Debug.Log(productCode);
    }

    string SimplifyCode(string codeToSimplify)
    {
        codeToSimplify = Regex.Replace(codeToSimplify, "[^\\w\\._]", "");

        return codeToSimplify.ToLower();
    }

    void Verified()
    {
        redeemPanel.alpha = 0f;
        verified = true;

        if (!ChallenegeMenu.returnFromChallenge)
        {
            frontPanel.alpha = 1f;
            background.mainTexture = Resources.Load("coderoad_opening") as Texture; //update file name for respective main menu background
        }
        else
        {
            cm.SetChallengeScreen();
        }
    }

    public void ErrorMessageButton()
    {
        redeemPanel.alpha = 1f;
        redeemErrorMessage.SetActive(false);
    }
}
